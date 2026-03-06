import os
from flask import Flask, render_template, request, jsonify
import json
from pillow_heif import register_heif_opener
register_heif_opener()

app = Flask(__name__)

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

        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        textos_path = os.path.join(app.config['UPLOAD_FOLDER'], 'textos.json')
        if os.path.exists(textos_path):
            with open(textos_path, 'r', encoding='utf-8') as f:
                textos = json.load(f)
        else:
            textos = {}

        for archivo in archivos:
            if archivo and allowed_file(archivo.filename):
                filename = archivo.filename
                ext = filename.rsplit('.', 1)[-1].lower()

                # Convertir HEIC/HEIF a JPEG
                if ext in ('heic', 'heif'):
                    filename = filename.rsplit('.', 1)[0] + '.jpg'
                    img = Image.open(archivo.stream)
                    ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    img.convert('RGB').save(ruta, 'JPEG', quality=90)
                else:
                    ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    archivo.save(ruta)

                subidos.append(filename)
                if texto:
                    textos[filename] = texto

        with open(textos_path, 'w', encoding='utf-8') as f:
            json.dump(textos, f, ensure_ascii=False)

        return jsonify({"ok": True, "archivos": subidos})

    except Exception as e:
        print("ERROR al subir:", e)
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/media")
def media():
    try:
        carpeta = app.config['UPLOAD_FOLDER']
        archivos = []
        extensiones_video = {'mp4', 'mov', 'webm'}
        extensiones_foto = {'png', 'jpg', 'jpeg', 'gif'}

        textos_path = os.path.join(carpeta, 'textos.json')
        textos = {}
        if os.path.exists(textos_path):
            with open(textos_path, 'r', encoding='utf-8') as f:
                textos = json.load(f)

        for f in os.listdir(carpeta):
            if f == 'textos.json':
                continue
            ext = f.rsplit('.', 1)[-1].lower()
            ruta = os.path.join(carpeta, f)
            fecha = os.path.getmtime(ruta)
            texto = textos.get(f, "")
            if ext in extensiones_foto:
                archivos.append({"nombre": f, "tipo": "foto", "fecha": fecha, "texto": texto})
            elif ext in extensiones_video:
                archivos.append({"nombre": f, "tipo": "video", "fecha": fecha, "texto": texto})

        archivos.sort(key=lambda x: x["fecha"])
        return jsonify(archivos)

    except Exception as e:
        print("ERROR al listar media:", e)
        return jsonify([]), 500

@app.route("/eliminar", methods=["POST"])
def eliminar():
    try:
        data = request.get_json()
        nombre = data.get("nombre")
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], nombre)

        if os.path.exists(ruta):
            os.remove(ruta)
            return jsonify({"ok": True})
        else:
            return jsonify({"ok": False, "error": "Archivo no encontrado"}), 404

    except Exception as e:
        print("ERROR al eliminar:", e)
        return jsonify({"ok": False, "error": str(e)}), 500

MUSIC_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'music')

@app.route("/subir-musica", methods=["POST"])
def subir_musica():
    try:
        archivo = request.files.get("musica")
        os.makedirs(MUSIC_FOLDER, exist_ok=True)

        for f in os.listdir(MUSIC_FOLDER):
            os.remove(os.path.join(MUSIC_FOLDER, f))

        if archivo:
            ruta = os.path.join(MUSIC_FOLDER, archivo.filename)
            archivo.save(ruta)
            return jsonify({"ok": True, "nombre": archivo.filename})

        return jsonify({"ok": False})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/musica")
def musica():
    try:
        os.makedirs(MUSIC_FOLDER, exist_ok=True)
        archivos = os.listdir(MUSIC_FOLDER)
        if archivos:
            return jsonify({"nombre": archivos[0]})
        return jsonify({"nombre": None})
    except Exception as e:
        return jsonify({"nombre": None})

@app.route("/eliminar-musica", methods=["POST"])
def eliminar_musica():
    try:
        for f in os.listdir(MUSIC_FOLDER):
            os.remove(os.path.join(MUSIC_FOLDER, f))
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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)