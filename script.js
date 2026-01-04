const canvas = document.getElementById('planoCartesiano');
const ctx = canvas.getContext('2d');
const escalaY = 150;
let puntos = [];
let unirPuntos = false;

// Función para inicializar y dibujar el fondo del plano
function dibujarPlano() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const originY = canvas.height / 2;
    const originX = canvas.width / 2;

    // Dibujar rejilla de fondo sutil
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    // Ejes principales
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY); // Eje X
    ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height); // Eje Y
    ctx.stroke();

    // Etiquetas de referencia en el eje Y
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText("1.0", originX + 10, originY - escalaY + 5);
    ctx.fillText("-1.0", originX + 10, originY + escalaY + 5);
    ctx.fillText("0", originX + 10, originY + 15);
}

function agregarPunto() {
    const input = document.getElementById('cosValue');
    const errorEtiqueta = document.getElementById('error');
    let grados = parseFloat(input.value.replace(',', '.'));

    // Validación: ahora aceptamos cualquier ángulo en grados
    if (isNaN(grados)) {
        errorEtiqueta.innerText = "¡Oye! Ingresa un número válido (ej: 45, 90, 180).";
        return;
    }

    errorEtiqueta.innerText = "";

    // LÓGICA MATEMÁTICA: Convertir grados a radianes y calcular coseno
    const radianes = grados * (Math.PI / 180);
    const resultadoCoseno = Math.cos(radianes);

    // Guardamos el objeto con el valor calculado y el ángulo original
    puntos.push({ 
        valor: resultadoCoseno, 
        angulo: grados,
        color: "#6366f1" 
    });

    dibujarTodo();
    input.value = "";
    input.focus();
}

function dibujarTodo() {
    dibujarPlano();
    const originY = canvas.height / 2;
    const spacing = 50; // Espacio horizontal entre puntos

    // Calcular el desplazamiento para que los puntos queden centrados o se muevan
    const totalWidth = (puntos.length - 1) * spacing;
    const startX = (canvas.width / 2) - (totalWidth / 2);

    // 1. Dibujar líneas (si la opción está activa)
    if (unirPuntos && puntos.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(99, 102, 241, 0.6)";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        
        puntos.forEach((p, i) => {
            const x = startX + (i * spacing);
            const y = originY - (p.valor * escalaY);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    // 2. Dibujar puntos y etiquetas
    puntos.forEach((p, i) => {
        const x = startX + (i * spacing);
        const y = originY - (p.valor * escalaY);

        // Brillo del punto
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(99, 102, 241, 0.8)";
        ctx.fillStyle = "#6366f1";
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Limpiar sombra para el texto
        ctx.shadowBlur = 0;

        // Etiqueta del valor (coseno)
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.valor.toFixed(2), x, y - 15);

        // Etiqueta del ángulo (grados)
        ctx.fillStyle = "#64748b";
        ctx.fillText(p.angulo + "°", x, originY + 20);
    });
}

function toggleLineas() {
    unirPuntos = !unirPuntos;
    const btn = document.getElementById('btnUnir');
    btn.classList.toggle('active');
    // Cambiar el texto del botón visualmente
    btn.innerHTML = unirPuntos ? "<span>✔️</span> Conectado" : "<span>🔗</span> Unir Puntos";
    dibujarTodo();
}

function limpiarTodo() {
    puntos = [];
    document.getElementById('error').innerText = "";
    dibujarPlano();
}

// Permitir presionar "Enter" para graficar
function validarEntrada(event) {
    if (event.key === "Enter") {
        agregarPunto();
    }
}

// Dibujo inicial
dibujarPlano();
