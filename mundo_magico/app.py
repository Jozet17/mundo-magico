import os
import io
import cloudinary
import cloudinary.uploader
import cloudinary.api
from urllib.parse import quote, unquote
from flask import Flask, render_template, request, jsonify
from pillow_heif import register_heif_opener
register_heif_opener()

app = Flask(__name__)

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'img', 'galeria')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'webm', 'heic', 'heif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/subir", methods=["POST"])
def subir():
    try:
        from PIL import Image

        archivos = request.files.getlist("archivos")
        texto = request.form.get("texto", "")
        subidos = []

        for archivo in archivos:
            if archivo and allowed_file(archivo.filename):
                filename = archivo.filename
                ext = filename.rsplit('.', 1)[-1].lower()

                context = f"texto={quote(texto, safe='')}" if texto else None

                if ext in ('heic', 'heif'):
                    filename = filename.rsplit('.', 1)[0] + '.jpg'
                    img = Image.open(archivo.stream)
                    buf = io.BytesIO()
                    img.convert('RGB').save(buf, 'JPEG', quality=90)
                    buf.seek(0)
                    cloudinary.uploader.upload(
                        buf,
                        public_id='galeria/' + filename.rsplit('.', 1)[0],
                        resource_type='image',
                        context=context
                    )
                else:
                    archivo.stream.seek(0)
                    resource_type = 'video' if ext in ('mp4', 'mov', 'webm') else 'image'
                    cloudinary.uploader.upload(
                        archivo.stream,
                        public_id='galeria/' + filename.rsplit('.', 1)[0],
                        resource_type=resource_type,
                        context=context
                    )

                subidos.append(filename)

        return jsonify({"ok": True, "archivos": subidos})

    except Exception as e:
        import traceback
        print("ERROR al subir:", traceback.format_exc())
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/media")
def media():
    try:
        archivos = []
        cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')

        resultado = cloudinary.api.resources(
            type='upload',
            prefix='galeria/',
            max_results=500,
            resource_type='image',
            context=True
        )
        resultado_video = cloudinary.api.resources(
            type='upload',
            prefix='galeria/',
            max_results=500,
            resource_type='video',
            context=True
        )

        todos = resultado.get('resources', []) + resultado_video.get('resources', [])

        for recurso in todos:
            public_id = recurso['public_id']
            fmt = recurso['format']
            nombre = public_id.replace('galeria/', '') + '.' + fmt
            resource_type = recurso['resource_type']
            fecha = recurso['created_at']
            texto_raw = recurso.get('context', {}).get('custom', {}).get('texto', '')
            texto = unquote(texto_raw)
            tipo = 'video' if resource_type == 'video' else 'foto'

            if tipo == 'video':
                url = f"https://res.cloudinary.com/{cloud_name}/video/upload/q_auto/{public_id}.{fmt}"
            else:
                url = f"https://res.cloudinary.com/{cloud_name}/image/upload/f_jpg,q_auto/{public_id}"

            archivos.append({
                "nombre": nombre,
                "tipo": tipo,
                "fecha": fecha,
                "texto": texto,
                "url": url
            })

        archivos.sort(key=lambda x: x["fecha"])
        return jsonify(archivos)

    except Exception as e:
        import traceback
        print("ERROR al listar media:", traceback.format_exc())
        return jsonify([]), 500

@app.route("/eliminar", methods=["POST"])
def eliminar():
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        public_id = 'galeria/' + nombre.rsplit('.', 1)[0]
        ext = nombre.rsplit('.', 1)[-1].lower()
        resource_type = 'video' if ext in ('mp4', 'mov', 'webm') else 'image'

        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return jsonify({"ok": True})

    except Exception as e:
        print("ERROR al eliminar:", e)
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/subir-musica", methods=["POST"])
def subir_musica():
    try:
        archivo = request.files.get("musica")
        if not archivo:
            return jsonify({"ok": False})

        try:
            cloudinary.uploader.destroy('musica/fondo', resource_type='video')
        except:
            pass

        ext = archivo.filename.rsplit('.', 1)[-1].lower()
        archivo.stream.seek(0)
        cloudinary.uploader.upload(
            archivo.stream,
            public_id='musica/fondo',
            resource_type='video',
            overwrite=True,
            format=ext
        )
        return jsonify({"ok": True, "nombre": archivo.filename})

    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/musica")
def musica():
    try:
        cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
        resultado = cloudinary.api.resource('musica/fondo', resource_type='video')
        fmt = resultado.get('format', 'mp3')
        url = f"https://res.cloudinary.com/{cloud_name}/video/upload/musica/fondo.{fmt}"
        return jsonify({"url": url})
    except Exception as e:
        return jsonify({"url": None})

@app.route("/eliminar-musica", methods=["POST"])
def eliminar_musica():
    try:
        cloudinary.uploader.destroy('musica/fondo', resource_type='video')
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

BIENVENIDA_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'bienvenida')
os.makedirs(BIENVENIDA_FOLDER, exist_ok=True)

@app.route("/static/bienvenida/<filename>")
def bienvenida_audio(filename):
    from flask import send_from_directory
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), 'static', 'bienvenida'),
        filename
    )

@app.route("/guardar-texto", methods=["POST"])
def guardar_texto():
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        texto = data.get("texto", "")
        public_id = 'galeria/' + nombre.rsplit('.', 1)[0]
        ext = nombre.rsplit('.', 1)[-1].lower()
        resource_type = 'video' if ext in ('mp4', 'mov', 'webm') else 'image'

        cloudinary.uploader.add_context(
            f"texto={quote(texto, safe='')}",
            public_ids=[public_id],
            resource_type=resource_type
        )
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)