const canvas = document.getElementById("mask");
const ctx = canvas.getContext("2d");

let currentTool = "scratch";

const shapes = ["circle", "square", "triangle"];
const shapeImgs = {};
shapes.forEach(shape => {
  const img = new Image();
  img.src = shape + ".png";
  shapeImgs[shape] = img;
});

function initCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
initCanvas();
window.addEventListener("resize", initCanvas);

document.querySelectorAll(".tool-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTool = btn.dataset.tool;
  });
});

let drawing = false;
let lastX = 0;
let lastY = 0;
let smoothX = 0;
let smoothY = 0;
const smoothFactor = 0.25;

canvas.addEventListener("mousedown", e => {
  drawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
  smoothX = lastX;
  smoothY = lastY;
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e){
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY;

  smoothX += (x - smoothX) * smoothFactor;
  smoothY += (y - smoothY) * smoothFactor;

  if (currentTool === "scratch"){
    ctx.globalCompositeOperation = "destination-out";

    const size = 25;
    const half = size / 2;

    const dx = smoothX - lastX;
    const dy = smoothY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    const lineCount = 6;
    for (let i = 0; i < lineCount; i++){
      const offset = (Math.random() - 0.5) * size * 0.7;
      ctx.lineWidth = Math.random() * 0.7 + 0.3;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(lastX + dirY * offset, lastY - dirX * offset);
      ctx.lineTo(smoothX + dirY * offset, smoothY - dirX * offset);
      ctx.stroke();
    }

    const dotCount = 25;
    for (let i = 0; i < dotCount; i++){
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * half;
      const px = smoothX + Math.cos(angle) * radius;
      const py = smoothY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  else if (currentTool === "erase"){
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 25;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(smoothX, smoothY);
    ctx.stroke();
  }

  else if (currentTool === "draw"){
    ctx.globalCompositeOperation = "source-over";
    const size = 30;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const img = shapeImgs[shape];

    if (img.complete){
      ctx.drawImage(img, smoothX - size / 2, smoothY - size / 2, size, size);
    }
  }

  lastX = smoothX;
  lastY = smoothY;
}
