const canvas = document.getElementById("mask");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bg = new Image();
bg.src = "background2.jpg";

const shapes = [];
const shapeImgs = [];

function makeShape(color, drawFn) {
    const c = document.createElement("canvas");
    c.width = 40;
    c.height = 40;
    const cx = c.getContext("2d");
    cx.fillStyle = color;
    drawFn(cx);
    const img = new Image();
    img.src = c.toDataURL();
    return img;
}

const circle = makeShape("#000", cx => {
    cx.beginPath();
    cx.arc(20, 20, 15, 0, Math.PI * 2);
    cx.fill();
});
const triangle = makeShape("#000", cx => {
    cx.beginPath();
    cx.moveTo(20, 5);
    cx.lineTo(35, 35);
    cx.lineTo(5, 35);
    cx.closePath();
    cx.fill();
});
const square = makeShape("#000", cx => {
    cx.fillRect(5, 5, 30, 30);
});

shapeImgs.push(circle, triangle, square);

bg.onload = () => {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

let currentTool = "scratch";
let drawing = false;
let lastSpawn = 0;

document.querySelectorAll(".tool").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTool = btn.dataset.tool;
    });
});

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);

canvas.addEventListener("mousemove", e => {
    if (!drawing) return;

    const x = e.clientX;
    const y = e.clientY;

    if (currentTool === "scratch") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        ctx.moveTo(x - 1, y - 1);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    else if (currentTool === "dig") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    }

    else if (currentTool === "paste") {
        ctx.globalCompositeOperation = "source-over";
        const now = performance.now();
        if (now - lastSpawn > 50) {
            const img = shapeImgs[Math.floor(Math.random() * shapeImgs.length)];
            ctx.drawImage(img, x - 20, y - 20);
            lastSpawn = now;
        }
    }
});
