const canvas = document.getElementById('planoCartesiano');
const ctx = canvas.getContext('2d');
const escalaY = 150;
let puntos = [];
let unirPuntos = false;

function dibujarPlano() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const originY = canvas.height / 2;
    const originX = canvas.width / 2;

    // Ejes elegantes
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
    ctx.stroke();

    // Marcadores
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText("1.0", originX + 10, originY - escalaY + 5);
    ctx.fillText("-1.0", originX + 10, originY + escalaY + 5);
}

function agregarPunto() {
    const input = document.getElementById('cosValue');
    let val = parseFloat(input.value.replace(',', '.'));
    
    if (isNaN(val) || val < -1 || val > 1) {
        document.getElementById('error').innerText = "¡Oye! Solo números entre -1 y 1.";
        return;
    }
    
    document.getElementById('error').innerText = "";
    puntos.push({ valor: val, color: "#6366f1" });
    dibujarTodo();
    input.value = "";
    input.focus();
}

function toggleLineas() {
    unirPuntos = !unirPuntos;
    document.getElementById('btnUnir').classList.toggle('active');
    dibujarTodo();
}

function dibujarTodo() {
    dibujarPlano();
    const originY = canvas.height / 2;
    const spacing = 40; // Espacio entre puntos en el eje X

    if (unirPuntos && puntos.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        puntos.forEach((p, i) => {
            const x = (canvas.width / 2) - ((puntos.length-1) * spacing / 2) + (i * spacing);
            const y = originY - (p.valor * escalaY);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    puntos.forEach((p, i) => {
        const x = (canvas.width / 2) - ((puntos.length-1) * spacing / 2) + (i * spacing);
        const y = originY - (p.valor * escalaY);

        // Efecto de brillo al punto
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function limpiarTodo() {
    puntos = [];
    dibujarPlano();
}

dibujarPlano();