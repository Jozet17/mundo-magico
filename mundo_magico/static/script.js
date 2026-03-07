/* ========================= */
/* INTRO CORAZÓN             */
/* ========================= */
const frases_default = [
    "Mi superhéroe favorito 💙",
    "Contigo todo es más divertido 🌈",
    "Mi corazón chiquito ❤️",
    "Mi campeón valiente ⭐",
    "Mamá siempre está contigo 🫶"
];

let clicksCorazon = 0;

function abrirCorazon() {
    // Precargar audio en la primera interacción del usuario
    if (!window.audioBienvenida) {
        window.audioBienvenida = new Audio('/static/bienvenida/bienvenida.mp3');
        window.audioBienvenida.load();
    }
    clicksCorazon++;

    const corazon = document.querySelector('.corazon-pulso');

    const onda = document.createElement('div');
    const colores = [
        'rgba(255, 180, 50, 0.5)',
        'rgba(255, 100, 150, 0.5)',
        'rgba(100, 220, 255, 0.5)',
        'rgba(255, 240, 100, 0.5)'
    ];
    onda.style.cssText = `
        position: fixed;
        left: 50vw; top: 50vh;
        border: 3px solid ${colores[clicksCorazon % colores.length]};
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: ondaExpandir 0.8s ease-out forwards;
        z-index: 101;
    `;
    document.body.appendChild(onda);
    setTimeout(() => onda.remove(), 900);

    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.innerHTML = ['🧡','✨','⭐','💫','🌟','💛','🤍'][Math.floor(Math.random()*7)];
        p.style.cssText = `
            position: fixed;
            font-size: ${14 + Math.random() * 20}px;
            left: ${40 + Math.random() * 20}vw;
            top: ${40 + Math.random() * 20}vh;
            pointer-events: none;
            z-index: 102;
            animation: desaparecer 1s forwards;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }

    corazon.style.transform = `scale(${1 + clicksCorazon * 0.15})`;

    if (clicksCorazon >= 5) {
        corazon.classList.add('corazon-explotando');

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.innerHTML = ['🧡','✨','⭐','💫','🌟','💛','🤍'][Math.floor(Math.random()*7)];
                star.style.cssText = `
                    position: fixed;
                    font-size: ${16 + Math.random() * 24}px;
                    left: ${Math.random() * 100}vw;
                    top: ${Math.random() * 100}vh;
                    pointer-events: none;
                    z-index: 102;
                    animation: desaparecer 1.2s forwards;
                `;
                document.body.appendChild(star);
                setTimeout(() => star.remove(), 1200);
            }, i * 30);
        }

        setTimeout(() => {
            const intro = document.getElementById('corazon-intro');
            intro.style.opacity = '0';
            setTimeout(() => {
                intro.style.display = 'none';
                mostrarCortinas(() => {
                    document.getElementById('inicio').style.display = 'flex';
                    iniciarContador();
                });
            }, 1000);
        }, 600);
    }
}

function iniciarFloating() {
    setInterval(() => {
        const el = document.createElement('div');
        const esCorazon = Math.random() > 0.5;
        el.innerHTML = esCorazon
            ? ['🩷','💗','💕'][Math.floor(Math.random()*3)]
            : ['🌹','🌺'][Math.floor(Math.random()*2)];
        el.style.cssText = `
            position: fixed;
            font-size: ${10 + Math.random() * 16}px;
            left: ${Math.random() * 100}vw;
            bottom: -30px;
            pointer-events: none;
            z-index: 101;
            opacity: ${0.6 + Math.random() * 0.4};
            animation: subirFlotando ${4 + Math.random() * 5}s ease-in forwards;
        `;
        document.getElementById('corazon-intro')?.appendChild(el);
        setTimeout(() => el.remove(), 9000);
    }, 350);
}

iniciarFloating();

/* ========================= */
/* CONTADOR                  */
/* ========================= */

function iniciarContador() {
    document.body.classList.add('fondo-mar');

    let tiempo = 5;
    const contadorElemento = document.getElementById("contador");
    const claveBox = document.getElementById("clave-box");
    const inicio = document.getElementById("inicio");

    contadorElemento.style.display = "flex";
    contadorElemento.textContent = tiempo;

    const emojis = ['🌊','🐠','🐚','⭐','🌺','✨','🦋'];
    const posiciones = [
        { left: '3vw',  top: '15vh' },
        { left: '4vw',  top: '40vh' },
        { left: '3vw',  top: '65vh' },
        { left: '5vw',  top: '85vh' },
        { left: '93vw', top: '15vh' },
        { left: '92vw', top: '40vh' },
        { left: '94vw', top: '65vh' },
        { left: '92vw', top: '85vh' },
        { left: '30vw', top: '4vh'  },
        { left: '70vw', top: '4vh'  },
        { left: '30vw', top: '92vh' },
        { left: '70vw', top: '92vh' },
    ];
    posiciones.forEach((pos, i) => {
        const em = document.createElement('div');
        em.className = 'estrella-mar';
        em.innerHTML = emojis[i % emojis.length];
        em.style.left = pos.left;
        em.style.top  = pos.top;
        em.style.fontSize = (18 + Math.random() * 16) + 'px';
        em.style.opacity = '0.9';
        em.style.animationDelay = (Math.random() * 3) + 's';
        em.style.animationDuration = (4 + Math.random() * 3) + 's';
        em.style.zIndex = '2';
        inicio.appendChild(em);
    });

    const intervaloContador = setInterval(() => {
        tiempo--;
        contadorElemento.textContent = tiempo;

        if (tiempo <= 0) {
            clearInterval(intervaloContador);
            contadorElemento.style.display = "none";

            // Mostrar clave inmediatamente
            claveBox.style.display = "block";

            // Reproducir audio y limpiar referencia al terminar
            try {
                const audio = window.audioBienvenida || new Audio('/static/bienvenida/bienvenida.mp3');
                audio.currentTime = 0;
                audio.volume = 1.0;
                audio.loop = false;
                audio.play().catch(() => {});
                audio.onended = () => {
                    audio.src = '';
                    window.audioBienvenida = null;
                };
            } catch(e) {}
        }
    }, 1000);
}

/* ========================= */
/* VERIFICAR CLAVE           */
/* ========================= */

function verificarClave() {
    let clave = document.getElementById("clave").value;
    let error = document.getElementById("error-clave");

    if (clave.toLowerCase() === "kaleth") {

        for (let i = 0; i < 25; i++) {
            let fuego = document.createElement("div");
            fuego.className = "fuego";
            fuego.innerHTML = "🎆";
            fuego.style.position = "fixed";
            fuego.style.left = (window.innerWidth  / 2 + Math.random() * 200 - 100) + "px";
            fuego.style.top  = (window.innerHeight / 2 + Math.random() * 200 - 100) + "px";
            document.body.appendChild(fuego);
            setTimeout(() => fuego.remove(), 1000);
        }

        setTimeout(() => {
            document.body.classList.remove('fondo-mar');
            document.body.classList.add('fondo-magico');
            limpiarEmojis();
            document.getElementById("clave-box").style.display = "none";
            document.getElementById("stitch-box").style.display = "block";
            agregarEmojisPersonaje('stitch-box', ['🌊','🐠','💙','🌺','⭐','✨','🦋']);
        }, 800);

    } else {
        error.textContent = "Palabra incorrecta... intenta otra vez ✨";
    }
}

/* ========================= */
/* EMOJIS POR PERSONAJE      */
/* ========================= */

function limpiarEmojis() {
    document.querySelectorAll('.estrella-mar').forEach(e => e.remove());
}

function agregarEmojisPersonaje(boxId, emojis) {
    const posiciones = [
        { left: '3vw',  top: '15vh' },
        { left: '4vw',  top: '40vh' },
        { left: '3vw',  top: '65vh' },
        { left: '5vw',  top: '85vh' },
        { left: '93vw', top: '15vh' },
        { left: '92vw', top: '40vh' },
        { left: '94vw', top: '65vh' },
        { left: '92vw', top: '85vh' },
        { left: '30vw', top: '4vh'  },
        { left: '70vw', top: '4vh'  },
        { left: '30vw', top: '92vh' },
        { left: '70vw', top: '92vh' },
    ];
    posiciones.forEach((pos, i) => {
        const em = document.createElement('div');
        em.className = 'estrella-mar';
        em.innerHTML = emojis[i % emojis.length];
        em.style.position = 'fixed';
        em.style.left = pos.left;
        em.style.top  = pos.top;
        em.style.fontSize = (18 + Math.random() * 16) + 'px';
        em.style.opacity = '0.9';
        em.style.zIndex = '2';
        em.style.pointerEvents = 'none';
        em.style.animation = `flotarMar ${4 + Math.random() * 3}s ease-in-out infinite`;
        em.style.animationDelay = (Math.random() * 3) + 's';
        document.body.appendChild(em);
    });
}

/* ========================= */
/* PERSONAJES                */
/* ========================= */

function mostrarSpiderman() {
    limpiarEmojis();
    document.body.classList.remove("fondo-magico");
    document.body.classList.add("fondo-spiderman");
    document.getElementById("stitch-box").style.display = "none";
    document.getElementById("spiderman-box").style.display = "block";
    agregarEmojisPersonaje('spiderman-box', ['🕷️','🕸️','⭐','💥','🦸','✨','🔵']);
}

function mostrarLotso() {
    limpiarEmojis();
    document.body.classList.remove("fondo-spiderman");
    document.body.classList.add("fondo-lotso");
    document.getElementById("spiderman-box").style.display = "none";
    document.getElementById("lotso-box").style.display = "block";
    agregarEmojisPersonaje('lotso-box', ['🍓','🌸','🌺','💝','🎀','✨','🩷']);
}

function mostrarHulk() {
    limpiarEmojis();
    document.body.classList.remove("fondo-lotso");
    document.body.classList.add("fondo-hulk");
    document.getElementById("lotso-box").style.display = "none";
    document.getElementById("hulk-box").style.display = "block";
    agregarEmojisPersonaje('hulk-box', ['💚','👊','🌿','⚡','🦖','✨','🟢']);
}

function mostrarMonster() {
    limpiarEmojis();
    document.body.classList.remove("fondo-hulk");
    document.body.classList.add("fondo-monster");
    document.getElementById("hulk-box").style.display = "none";
    document.getElementById("monster-box").style.display = "block";
    agregarEmojisPersonaje('monster-box', ['👾','🚪','😱','💜','👁️','✨','🔮']);
}

function entrarMundo(event) {
    if (event) event.stopPropagation();
    limpiarEmojis();
    document.body.onclick = null;
    explosionMagica();
    setTimeout(() => {
        document.getElementById("inicio").style.display = "none";
        document.getElementById("contenido").style.display = "flex";
        iniciarLibro();
    }, 800);
}

function explosionMagica() {
    for (let i = 0; i < 40; i++) {
        let brillo = document.createElement("div");
        brillo.className = "estrella-click";
        brillo.innerHTML = "✨";
        brillo.style.left = (window.innerWidth / 2) + "px";
        brillo.style.top = (window.innerHeight / 2) + "px";
        document.body.appendChild(brillo);
        setTimeout(() => brillo.remove(), 1000);
    }
}

/* ========================= */
/* GALERÍA — LIBRO MÁGICO   */
/* ========================= */

let fotos = [
    "img/galeria/foto1.jpeg",
    "img/galeria/foto2.jpeg",
    "img/galeria/foto3.jpeg",
    "img/galeria/foto4.jpeg",
    "img/galeria/foto5.jpeg"
];

let frases = [...frases_default];
let indice = 0;
let volteando = false;
let autoActivo = false;
let intervaloAuto = null;

async function iniciarLibro() {
    const libro = document.querySelector('.libro');
    if (!libro) return;

    let archivosServidor = [];

    try {
        const res = await fetch('/media');
        archivosServidor = await res.json();
        if (archivosServidor.length > 0) {
            fotos = archivosServidor.map(a => a.url || `/static/img/galeria/${a.nombre}`);
            frases = archivosServidor.map((a, i) => a.texto || frases_default[i % frases_default.length]);
        }
    } catch(e) {
        console.log('Usando fotos locales');
    }

    fotos.forEach((src, i) => {
        const pag = document.createElement('div');
        pag.className = 'pagina';
        pag.style.zIndex = fotos.length - i;
        const nombre = archivosServidor[i]?.nombre || src.split('/').pop();
        const esVideo = ['mp4','mov','webm'].includes(nombre.split('.').pop().toLowerCase());
        const urlArchivo = archivosServidor[i]?.url || src;

        if (esVideo) {
            pag.innerHTML = `
                <video playsinline controls style="
                    width:100%; height:100%; object-fit:cover; display:block;
                ">
                    <source src="${urlArchivo}?_cb=${Date.now()}">
                </video>`;
        } else {
            pag.innerHTML = `<img src="${urlArchivo}" alt="foto ${i+1}">`;
        }

        pag.dataset.nombre = nombre;

        let timer = null;
        const iniciarEliminar = () => { timer = setTimeout(() => mostrarConfirmEliminar(pag, nombre), 6000); };
        const cancelarEliminar = () => clearTimeout(timer);
        pag.addEventListener('mousedown', iniciarEliminar);
        pag.addEventListener('mouseup', cancelarEliminar);
        pag.addEventListener('mouseleave', cancelarEliminar);
        pag.addEventListener('touchstart', iniciarEliminar);
        pag.addEventListener('touchend', cancelarEliminar);

        libro.appendChild(pag);
    });

    document.getElementById('frase').textContent = frases[0];

    libro.addEventListener('click', () => {
        if (!autoActivo) pasarPagina();
    });

    let touchStartX = 0;
    libro.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    libro.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 40) pasarPagina();
    });

    iniciarEstrellasFondo();
    iniciarMusica();

    const lomo = document.querySelector('.lomo');
    if (lomo) {
        for (let i = 0; i < 10; i++) {
            const anillo = document.createElement('div');
            anillo.style.cssText = `
                width: 16px; height: 10px;
                border: 3px solid #b039e0;
                border-radius: 50%;
                background: transparent;
                box-shadow: 0 0 6px rgba(176, 57, 224, 0.9),
                            inset 0 0 4px rgba(206, 147, 216, 0.4);
                z-index: 6; position: relative;
            `;
            lomo.appendChild(anillo);
        }
    }
}

function iniciarEstrellasFondo() {
    setInterval(() => {
        const estrella = document.createElement('div');
        estrella.innerHTML = '★';
        estrella.style.cssText = `
            position: fixed;
            color: #fde68a;
            font-size: ${12 + Math.random() * 22}px;
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: ${0.7 + Math.random() * 0.3};
            pointer-events: none;
            z-index: 0;
            text-shadow: 0 0 8px #fbbf24, 0 0 16px #f59e0b;
            animation: estrellaFall ${4 + Math.random() * 5}s linear forwards;
        `;
        document.body.appendChild(estrella);
        setTimeout(() => estrella.remove(), 9000);
    }, 250);
}

function pasarPagina() {
    if (volteando) return;

    const paginas = document.querySelectorAll('.pagina');
    const paginaActual = paginas[indice];

    volteando = true;

    const libro = document.querySelector('.libro');
    const rect = libro.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'polvo-pagina';
        p.innerHTML = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
        p.style.left = (rect.left + rect.width * 0.5 + Math.random()*40 - 20) + 'px';
        p.style.top  = (rect.top  + rect.height * 0.4 + Math.random()*40 - 20) + 'px';
        p.style.position = 'fixed';
        p.style.setProperty('--dx', (Math.random()*100 - 50) + 'px');
        p.style.setProperty('--dy', (Math.random()*80  - 60) + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }

    paginaActual.classList.add('volteando');

    setTimeout(() => {
        paginaActual.style.display = 'none';

        // Silenciar listeners del video actual antes de pausarlo
        const videoActual = paginaActual.querySelector('video');
        if (videoActual) {
            const nuevoActual = videoActual.cloneNode(true);
            videoActual.parentNode.replaceChild(nuevoActual, videoActual);
            nuevoActual.pause();
            nuevoActual.currentTime = 0;
        }

        const siguiente = (indice + 1) % paginas.length;

        if (siguiente === 0) {
            if (autoActivo) {
                clearInterval(intervaloAuto);
                intervaloAuto = null;
            }
            mostrarFin(() => {
                paginas.forEach(p => {
                    p.style.display = 'block';
                    p.classList.remove('volteando');
                    p.style.transform = 'rotateY(0deg)';
                    const v = p.querySelector('video');
                    if (v) { v.pause(); v.currentTime = 0; }
                });
                indice = 0;
                const fraseEl = document.getElementById('frase');
                fraseEl.style.opacity = 0;
                setTimeout(() => {
                    fraseEl.textContent = frases[0];
                    fraseEl.style.opacity = 1;
                }, 300);
                if (autoActivo) {
                    intervaloAuto = setInterval(pasarPagina, 4000);
                }
                reanudarMusica();
                volteando = false;
            });
        } else {
            indice = siguiente;
            const fraseEl = document.getElementById('frase');
            fraseEl.style.opacity = 0;
            setTimeout(() => {
                fraseEl.textContent = frases[indice] || '';
                fraseEl.style.opacity = 1;
            }, 300);

            const sigPagina = paginas[indice];
            const sigVideo = sigPagina?.querySelector('video');

            if (sigVideo) {
                pausarMusica();
                sigVideo.currentTime = 0;

                const nuevoVideo = sigVideo.cloneNode(true);
                sigVideo.parentNode.replaceChild(nuevoVideo, sigVideo);

                nuevoVideo.addEventListener('play', () => pausarMusica());
                nuevoVideo.addEventListener('seeking', () => pausarMusica());
                nuevoVideo.addEventListener('pause', () => reanudarMusica());
                nuevoVideo.addEventListener('ended', () => {
                    reanudarMusica();
                    if (autoActivo) {
                        intervaloAuto = setInterval(pasarPagina, 4000);
                    }
                });

                if (autoActivo) {
                    clearInterval(intervaloAuto);
                    intervaloAuto = null;
                    nuevoVideo.play();
                }
            } else {
                reanudarMusica();
            }

            volteando = false;
        }
    }, 900);
}

function mostrarFin(callback) {
    const eraAuto = autoActivo;

    const overlay = document.createElement('div');
    overlay.id = 'fin-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at center,
            rgba(60, 0, 80, 0.97) 0%,
            rgba(10, 0, 30, 0.98) 100%);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.8s ease;
        cursor: pointer;
    `;

    overlay.innerHTML = `
    <div style="
        font-family: 'Georgia', serif;
        font-size: 3.5rem;
        background: linear-gradient(90deg, #fde68a, #f9a8d4, #a78bfa, #67e8f9, #fde68a);
        background-size: 300% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: brilloTitulo 2s ease infinite alternate;
        letter-spacing: 8px;
        margin-bottom: 16px;
    ">✨ FIN ✨</div>
    <div style="
        font-family: 'Georgia', serif;
        font-size: 1.1rem;
        color: rgba(255,255,255,0.5);
        letter-spacing: 2px;
        margin-top: 10px;
    ">${eraAuto ? '' : 'toca para volver a empezar'}</div>
    <button onclick="event.stopPropagation(); abrirSubir();" style="
        margin-top: 30px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 2px solid rgba(167,139,250,0.6);
        background: rgba(167,139,250,0.15);
        color: #c4b5fd;
        font-size: 1.8rem;
        cursor: pointer;
        backdrop-filter: blur(6px);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    ">+</button>
    <div style="color:rgba(255,255,255,0.25); font-size:0.75rem; margin-top:8px; letter-spacing:1px;">
        agregar fotos / videos
    </div>
`;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    });

    const intervaloParticulas = setInterval(() => {
        const star = document.createElement('div');
        star.innerHTML = ['★','✦','✧','💫','✨'][Math.floor(Math.random()*5)];
        star.style.cssText = `
            position: fixed;
            color: #fde68a;
            font-size: ${14 + Math.random() * 20}px;
            left: ${Math.random() * 100}vw;
            top: -20px;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 0 10px #fbbf24;
            animation: estrellaFall ${3 + Math.random() * 4}s linear forwards;
        `;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 7000);
    }, 150);

    const cerrar = () => {
        clearInterval(intervaloParticulas);
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            callback();
        }, 800);
    };

    if (eraAuto) {
        setTimeout(cerrar, 3000);
    } else {
        overlay.addEventListener('click', cerrar, { once: true });
    }
}

function toggleAuto() {
    autoActivo = !autoActivo;
    const btn = document.getElementById('btn-auto');

    if (autoActivo) {
        btn.textContent = '⏸';
        btn.style.background = 'rgba(167, 139, 250, 0.4)';
        intervaloAuto = setInterval(pasarPagina, 4000);
    } else {
        btn.textContent = '▶';
        btn.style.background = 'rgba(255,255,255,0.1)';
        clearInterval(intervaloAuto);
        intervaloAuto = null;
    }
}

/* ========================= */
/* SUBIR FOTOS Y VIDEOS      */
/* ========================= */

function abrirSubir() {
    pausarMusica();
    document.getElementById('panel-subir').style.display = 'block';
    document.getElementById('preview-lista').innerHTML = '';
    document.getElementById('subir-status').textContent = '';
    document.getElementById('input-archivos').value = '';
}

function cerrarSubir() {
    document.getElementById('panel-subir').style.display = 'none';
    reanudarMusica();
}

function previsualizarArchivos() {
    const input = document.getElementById('input-archivos');
    const lista = document.getElementById('preview-lista');
    lista.innerHTML = '';

    Array.from(input.files).forEach(file => {
        const item = document.createElement('div');
        item.style.cssText = `
            color: #e9d5ff;
            font-size: 0.82rem;
            padding: 4px 8px;
            background: rgba(167,139,250,0.1);
            border-radius: 8px;
            margin-bottom: 4px;
            text-align: left;
        `;
        const icono = file.type.startsWith('video') ? '🎬' : '🖼️';
        item.textContent = `${icono} ${file.name}`;
        lista.appendChild(item);
    });
}

async function subirArchivos() {
    const input = document.getElementById('input-archivos');
    const status = document.getElementById('subir-status');
    const texto = document.getElementById('texto-archivo').value.trim();

    if (!input.files.length) {
        status.textContent = 'Selecciona al menos un archivo.';
        return;
    }

    const archivos = Array.from(input.files);
    const subidos = [];
    const cloudName = 'djsgmhnll';

    for (const archivo of archivos) {
        try {
            status.textContent = `Subiendo ${archivo.name}... ✨`;

            const formData = new FormData();
            formData.append('file', archivo);
            formData.append('upload_preset', 'mundo_magico');
            formData.append('folder', 'galeria');

            const esVideo = ['mp4','mov','webm'].includes(archivo.name.split('.').pop().toLowerCase());
            const tipo = esVideo ? 'video' : 'image';

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${tipo}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.secure_url) {
                subidos.push(archivo.name);
                if (texto) {
                    await fetch('/guardar-texto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre: data.original_filename + '.' + data.format, texto })
                    });
                }
            } else {
                console.error('Error Cloudinary:', data);
                status.textContent = `Error subiendo ${archivo.name}: ${data.error?.message || 'error desconocido'}`;
            }
        } catch(e) {
            console.error('Error subiendo archivo:', e);
            status.textContent = `Error de conexión subiendo ${archivo.name}`;
        }
    }

    if (subidos.length > 0) {
        status.textContent = `✅ ${subidos.length} archivo(s) subido(s)`;
        setTimeout(() => {
            cerrarSubir();
            reiniciarTodo();
        }, 1500);
    }
}

async function reiniciarTodo() {
    try {
        const res = await fetch('/media');
        const archivos = await res.json();

        const musicaEstabaActiva = musicaActiva;

        // Cerrar panel fin si está abierto
        const finOverlay = document.getElementById('fin-overlay');
        if (finOverlay) finOverlay.remove();

        const libro = document.querySelector('.libro');
        libro.querySelectorAll('.pagina').forEach(p => p.remove());
        indice = 0;
        volteando = false;

        fotos = archivos.map(a => a.url || `/static/img/galeria/${a.nombre}`);
        frases = archivos.map((a, i) => a.texto || frases_default[i % frases_default.length]);

        archivos.forEach((archivo, i) => {
            const pag = document.createElement('div');
            pag.className = 'pagina';
            pag.style.zIndex = archivos.length - i;
            pag.style.transform = '';
            pag.style.opacity = '1';
            pag.style.pointerEvents = 'auto';
            pag.style.display = 'block';
            pag.dataset.nombre = archivo.nombre;

            const urlArchivo = archivo.url || `/static/img/galeria/${archivo.nombre}`;

            if (archivo.tipo === 'video') {
                pag.innerHTML = `
                    <video playsinline controls style="
                        width:100%; height:100%; object-fit:cover; display:block;
                    ">
                        <source src="${urlArchivo}?_cb=${Date.now()}">
                    </video>`;
            } else {
                pag.innerHTML = `<img src="${urlArchivo}?t=${Date.now()}" alt="foto ${i+1}">`;
            }

            let timer = null;
            const iniciarEliminar = () => {
                timer = setTimeout(() => mostrarConfirmEliminar(pag, archivo.nombre), 6000);
            };
            const cancelarEliminar = () => clearTimeout(timer);

            pag.addEventListener('mousedown', iniciarEliminar);
            pag.addEventListener('mouseup', cancelarEliminar);
            pag.addEventListener('mouseleave', cancelarEliminar);
            pag.addEventListener('touchstart', iniciarEliminar);
            pag.addEventListener('touchend', cancelarEliminar);

            libro.appendChild(pag);
        });

        document.getElementById('frase').textContent = frases[0] || '';

        if (musicaEstabaActiva && audioFondo) {
            audioFondo.play();
            musicaActiva = true;
            actualizarBtnMusica();
        }
    } catch(e) {
        console.error('Error al reiniciar:', e);
    }
}

function mostrarConfirmEliminar(pag, nombre) {
    // Overlay de confirmación
    const confirm = document.createElement('div');
    confirm.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85);
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;
    confirm.innerHTML = `
        <div style="font-size: 4rem;">🗑️</div>
        <div style="
            font-family: 'Georgia', serif;
            font-size: 1.1rem;
            color: white;
            margin: 16px 0;
            letter-spacing: 2px;
        ">¿Eliminar este archivo?</div>
        <div style="display:flex; gap:16px; margin-top:10px;">
            <button id="btn-confirmar-eliminar" style="
                padding: 10px 24px;
                border-radius: 20px;
                border: none;
                background: #e53935;
                color: white;
                font-size: 1rem;
                cursor: pointer;
            ">Eliminar</button>
            <button id="btn-cancelar-eliminar" style="
                padding: 10px 24px;
                border-radius: 20px;
                border: 1px solid rgba(255,255,255,0.3);
                background: transparent;
                color: white;
                font-size: 1rem;
                cursor: pointer;
            ">Cancelar</button>
        </div>
    `;

    document.body.appendChild(confirm);

    document.getElementById('btn-cancelar-eliminar').onclick = () => confirm.remove();
    document.getElementById('btn-confirmar-eliminar').onclick = async () => {
        await eliminarArchivo(nombre);
        confirm.remove();
        pag.remove();
        mostrarToast('🗑️ Eliminado correctamente');
        await reiniciarTodo();
    };
}

async function eliminarArchivo(nombre) {
    try {
        await fetch('/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
    } catch (e) {
        console.error('Error al eliminar:', e);
    }
}

function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(30, 30, 30, 0.95);
        color: white;
        padding: 12px 28px;
        border-radius: 25px;
        font-family: 'Georgia', serif;
        font-size: 1rem;
        z-index: 3000;
        letter-spacing: 1px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        transition: opacity 0.5s;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

/* ========================= */
/* MÚSICA DE FONDO           */
/* ========================= */

let audioFondo = null;
let musicaActiva = false;
let timerMusica = null;

async function iniciarMusica() {
    // Cargar música guardada en servidor al arrancar la galería
    try {
        const res = await fetch('/musica');
        const data = await res.json();
        if (data.nombre) {
            audioFondo = new Audio(`/static/music/${data.nombre}`);
            audioFondo.loop = true;
            audioFondo.volume = 0.5;
            audioFondo.play();
            musicaActiva = true;
            actualizarBtnMusica();
        }
    } catch(e) {
        console.log('Sin música guardada');
    }
}

function toggleMusica() {
    const input = document.getElementById('input-musica');
    if (!audioFondo) {
        input.click();
        return;
    }
    if (musicaActiva) {
        pausarMusica();
    } else {
        reanudarMusica();
    }
}

function cargarMusica() {
    const input = document.getElementById('input-musica');
    const archivo = input.files[0];
    if (!archivo) return;

    // Subir al servidor
    const formData = new FormData();
    formData.append('musica', archivo);
    fetch('/subir-musica', { method: 'POST', body: formData });

    if (audioFondo) {
        audioFondo.pause();
        audioFondo = null;
    }

    audioFondo = new Audio(URL.createObjectURL(archivo));
    audioFondo.loop = true;
    audioFondo.volume = 0.5;
    audioFondo.play();
    musicaActiva = true;
    actualizarBtnMusica();
}

function pausarMusica() {
    if (audioFondo && musicaActiva) {
        audioFondo.pause();
        musicaActiva = false;
        actualizarBtnMusica();
    }
}

function reanudarMusica() {
    if (audioFondo && !musicaActiva) {
        audioFondo.play();
        musicaActiva = true;
        actualizarBtnMusica();
    }
}

function actualizarBtnMusica() {
    const btn = document.getElementById('btn-musica');
    if (!btn) return;
    if (musicaActiva) {
        btn.style.borderColor = '#fde68a';
        btn.style.color = '#fde68a';
        btn.style.boxShadow = '0 0 15px rgba(253,230,138,0.5)';
    } else {
        btn.style.borderColor = '#f9a8d4';
        btn.style.color = '#f9a8d4';
        btn.style.boxShadow = 'none';
    }
}

// Mantener presionado 3s para eliminar música
const btnMusica = document.getElementById('btn-musica');
if (btnMusica) {
    const iniciarEliminarMusica = () => {
        timerMusica = setTimeout(async () => {
            if (!audioFondo) return;
            await fetch('/eliminar-musica', { method: 'POST' });
            audioFondo.pause();
            audioFondo = null;
            musicaActiva = false;
            actualizarBtnMusica();
            mostrarToast('🗑️ Música eliminada');
        }, 6000);
    };
    const cancelarEliminarMusica = () => clearTimeout(timerMusica);

    btnMusica.addEventListener('mousedown', iniciarEliminarMusica);
    btnMusica.addEventListener('mouseup', cancelarEliminarMusica);
    btnMusica.addEventListener('mouseleave', cancelarEliminarMusica);
    btnMusica.addEventListener('touchstart', iniciarEliminarMusica);
    btnMusica.addEventListener('touchend', cancelarEliminarMusica);
}

/* ========================= */
/* PANTALLA BIENVENIDA       */
/* ========================= */

function iniciarEstrellasBienvenida() {
    const contenedor = document.getElementById('estrellas-bienvenida');
    if (!contenedor) return;

    // Estrellas fijas de fondo
    for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.innerHTML = ['★','✦','✧','·'][Math.floor(Math.random()*4)];
        s.style.cssText = `
            position: fixed;
            color: ${['#fde68a','#c4b5fd','#ffffff','#f9a8d4'][Math.floor(Math.random()*4)]};
            font-size: ${4 + Math.random() * 14}px;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            opacity: ${0.3 + Math.random() * 0.7};
            pointer-events: none;
            z-index: 1;
            animation: parpadeo ${1.5 + Math.random() * 3}s ease infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        contenedor.appendChild(s);
    }

    // Estrellas cayendo
    function estrellaCayendo() {
        const s = document.createElement('div');
        s.innerHTML = ['★','✦','✧','✨'][Math.floor(Math.random()*4)];
        s.style.cssText = `
            position: fixed;
            color: ${['#fde68a','#c4b5fd','#ffffff','#f9a8d4','#67e8f9'][Math.floor(Math.random()*5)]};
            font-size: ${8 + Math.random() * 16}px;
            left: ${Math.random() * 100}vw;
            top: -20px;
            pointer-events: none;
            z-index: 1;
            opacity: ${0.5 + Math.random() * 0.5};
            animation: estrellaFall ${3 + Math.random() * 4}s linear forwards;
        `;
        contenedor.appendChild(s);
        setTimeout(() => s.remove(), 7000);
    }
    setInterval(estrellaCayendo, 300);

    // Fuegos artificiales
    function lanzarFuego() {
        const pantalla = document.getElementById('pantalla-bienvenida');
        if (!pantalla || pantalla.style.display === 'none') return;

        const x = 15 + Math.random() * 70;
        const y = 10 + Math.random() * 50;
        const colores = ['#fde68a','#f9a8d4','#a78bfa','#67e8f9','#ff6b6b','#fff','#c4b5fd'];
        const color = colores[Math.floor(Math.random() * colores.length)];
        const particulas = 18 + Math.floor(Math.random() * 14);

        for (let i = 0; i < particulas; i++) {
            const p = document.createElement('div');
            const angulo = (360 / particulas) * i;
            const distancia = 40 + Math.random() * 60;
            const rad = angulo * Math.PI / 180;
            const dx = Math.cos(rad) * distancia;
            const dy = Math.sin(rad) * distancia;

            p.style.cssText = `
                position: fixed;
                left: ${x}vw;
                top: ${y}vh;
                width: ${2 + Math.random() * 3}px;
                height: ${2 + Math.random() * 3}px;
                border-radius: 50%;
                background: ${color};
                box-shadow: 0 0 6px ${color}, 0 0 12px ${color};
                pointer-events: none;
                z-index: 3;
                transition: transform ${0.6 + Math.random() * 0.4}s ease-out,
                            opacity ${0.6 + Math.random() * 0.4}s ease-out;
                opacity: 1;
            `;
            contenedor.appendChild(p);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    p.style.transform = `translate(${dx}px, ${dy}px)`;
                    p.style.opacity = '0';
                });
            });
            setTimeout(() => p.remove(), 1200);
        }

        // Destello central
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            left: ${x}vw;
            top: ${y}vh;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 20px ${color}, 0 0 40px ${color};
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 3;
            animation: flashFuego 0.4s ease-out forwards;
        `;
        contenedor.appendChild(flash);
        setTimeout(() => flash.remove(), 400);
    }

    lanzarFuego();
    setInterval(lanzarFuego, 1200);
}

function entrarBienvenida() {
    const pantalla = document.getElementById('pantalla-bienvenida');
    pantalla.style.opacity = '0';
    pantalla.style.pointerEvents = 'none';
    setTimeout(() => {
        pantalla.style.display = 'none';
        document.getElementById('corazon-intro').style.display = 'flex';
    }, 1000);
}

function mostrarCortinas(callback) {
    const cortinasDiv = document.createElement('div');
    cortinasDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 300;
        pointer-events: none;
        display: flex;
    `;

    const cortIzq = document.createElement('div');
    cortIzq.style.cssText = `
        width: 50%;
        height: 100%;
        background: linear-gradient(135deg,
            #4a0080 0%, #6a0090 20%,
            #8b0090 40%, #6a0090 60%, #4a0080 100%);
        transform-origin: left center;
        transform: scaleX(1);
        transition: transform 2s cubic-bezier(0.645, 0.045, 0.355, 1.000);
        box-shadow: inset -20px 0 40px rgba(0,0,0,0.5),
                    inset -40px 0 80px rgba(100,0,150,0.3);
        position: relative; overflow: hidden;
    `;

    const cortDer = document.createElement('div');
    cortDer.style.cssText = `
        width: 50%;
        height: 100%;
        background: linear-gradient(225deg,
            #4a0080 0%, #6a0090 20%,
            #8b0090 40%, #6a0090 60%, #4a0080 100%);
        transform-origin: right center;
        transform: scaleX(1);
        transition: transform 2s cubic-bezier(0.645, 0.045, 0.355, 1.000);
        box-shadow: inset 20px 0 40px rgba(0,0,0,0.5),
                    inset 40px 0 80px rgba(100,0,150,0.3);
        position: relative; overflow: hidden;
    `;

    for (let i = 0; i < 6; i++) {
        const pl = document.createElement('div');
        pl.style.cssText = `
            position: absolute; top: 0;
            left: ${8 + i * 15}%; width: 6%; height: 100%;
            background: linear-gradient(to right,
                rgba(0,0,0,0.3) 0%,
                rgba(255,255,255,0.05) 50%,
                rgba(0,0,0,0.2) 100%);
            pointer-events: none;
        `;
        cortIzq.appendChild(pl);
        const pr = pl.cloneNode();
        cortDer.appendChild(pr);
    }

    const franja = document.createElement('div');
    franja.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100vw; height: 28px;
        background: linear-gradient(90deg,
            #4a0080, #fde68a, #f9a8d4,
            #a78bfa, #67e8f9, #fde68a, #4a0080);
        background-size: 300% auto;
        animation: brilloTitulo 2s ease infinite alternate;
        z-index: 301;
        box-shadow: 0 4px 20px rgba(253,230,138,0.6);
        pointer-events: none;
    `;

    const borlas = document.createElement('div');
    borlas.style.cssText = `
        position: fixed; top: 20px; left: 0;
        width: 100vw; height: 40px;
        z-index: 301; pointer-events: none;
        display: flex; justify-content: space-around;
        align-items: flex-start;
    `;
    for (let i = 0; i < 16; i++) {
        const b = document.createElement('div');
        b.style.cssText = `
            width: 14px; height: 30px;
            background: linear-gradient(to bottom, #fde68a, #f59e0b);
            border-radius: 0 0 50% 50%;
            box-shadow: 0 0 8px rgba(253,230,138,0.8);
        `;
        borlas.appendChild(b);
    }

    cortinasDiv.appendChild(cortIzq);
    cortinasDiv.appendChild(cortDer);
    document.body.appendChild(franja);
    document.body.appendChild(borlas);
    document.body.appendChild(cortinasDiv);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                cortIzq.style.transform = 'scaleX(0)';
                cortDer.style.transform = 'scaleX(0)';

                for (let i = 0; i < 30; i++) {
                    setTimeout(() => {
                        const d = document.createElement('div');
                        d.innerHTML = ['✨','⭐','💫','★','✦'][Math.floor(Math.random()*5)];
                        d.style.cssText = `
                            position: fixed;
                            font-size: ${16 + Math.random() * 24}px;
                            left: ${Math.random() * 100}vw;
                            top: ${Math.random() * 100}vh;
                            pointer-events: none;
                            z-index: 302;
                            color: ${['#fde68a','#c4b5fd','#f9a8d4','#fff'][Math.floor(Math.random()*4)]};
                            animation: desaparecer 1.2s forwards;
                        `;
                        document.body.appendChild(d);
                        setTimeout(() => d.remove(), 1200);
                    }, i * 80);
                }

                setTimeout(() => {
                    cortinasDiv.remove();
                    franja.remove();
                    borlas.remove();
                    if (callback) callback();
                }, 2500);

            }, 300);
        });
    });
}

iniciarEstrellasBienvenida();