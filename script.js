const canvas = document.getElementById('planoCartesiano');
const ctx = canvas.getContext('2d');

// Configuraciones de precisión
const escalaY = 100; // Cuántos píxeles mide 1 unidad (Amplitud)
const escalaX = 50;  // Píxeles por cada radián (Frecuencia)
let puntosUsuario = [];
let unirPuntos = true;

function dibujarPlano() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const originY = canvas.height / 2;
    const originX = canvas.width / 2;

    // Dibujar la curva "Guía" (La función coseno matemática pura)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"; // Gris muy suave
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x++) {
        // Traducimos el píxel X a un valor matemático
        const valorMatematicoX = (x - originX) / escalaX;
        const valorMatematicoY = Math.cos(valorMatematicoX);
        const y = originY - (valorMatematicoY * escalaY);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Ejes Cartesianos
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
    ctx.stroke();

    // Marcas de precisión (1, 0, -1)
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText(" 1.0", originX + 5, originY - escalaY);
    ctx.fillText("-1.0", originX + 5, originY + escalaY);
    ctx.fillText(" 0", originX + 5, originY + 15);
}

function agregarPunto() {
    const input = document.getElementById('cosValue');
    const valorIngresado = parseFloat(input.value.replace(',', '.'));

    // Validación para que sea preciso: Buscamos el ángulo cuyo coseno sea el valor
    // Usamos Math.acos para encontrar el ángulo exacto
    if (isNaN(valorIngresado) || valorIngresado < -1 || valorIngresado > 1) {
        document.getElementById('error').innerText = "Valor fuera de rango (-1 a 1)";
        return;
    }

    document.getElementById('error').innerText = "";
    
    // El ángulo en radianes es el arco coseno del valor
    const anguloRadianes = Math.acos(valorIngresado);
    
    puntosUsuario.push({
        xMat: anguloRadianes,
        yMat: valorIngresado,
        label: valorIngresado
    });

    dibujarTodo();
    input.value = "";
}

function dibujarTodo() {
    dibujarPlano();
    const originY = canvas.height / 2;
    const originX = canvas.width / 2;

    puntosUsuario.forEach(p => {
        // Posicionamiento preciso basado en matemáticas
        const canvasX = originX + (p.xMat * escalaX);
        const canvasY = originY - (p.yMat * escalaY);

        // Dibujar el punto con brillo
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#6366f1";
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Etiqueta de precisión
        ctx.fillStyle = "#1e293b";
        ctx.fillText(`cos⁻¹(${p.label})`, canvasX + 8, canvasY - 8);
    });
}

function limpiarTodo() {
    puntosUsuario = [];
    dibujarPlano();
}

dibujarPlano();
