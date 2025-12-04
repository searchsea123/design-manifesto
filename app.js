const canvas = document.getElementById("mask");
const ctx = canvas.getContext("2d");

let currentTool = 'scratch'; // scratch, erase, draw

const shapes = ['circle', 'square', 'triangle'];
const shapeImgs = {};
shapes.forEach(shape => {
  const img = new Image();
  img.src = shape + '.png'; // 프로젝트에 circle.png, square.png, triangle.png 필요
  shapeImgs[shape] = img;
});

// 캔버스 세팅
function initCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
initCanvas();
window.addEventListener("resize", initCanvas);

// 툴 선택 이벤트
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
  });
});

// 공통 변수
let drawing = false;
let lastX = 0;
let lastY = 0;

let smoothX = 0;
let smoothY = 0;
const smoothFactor = 0.25;

// 이벤트
canvas.addEventListener("mousedown", e => {
  drawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
  smoothX = lastX;
  smoothY = lastY;
});
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e){
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY;

  // 손떨림 방지 → 부드러운 좌표 이동
  smoothX += (x - smoothX) * smoothFactor;
  smoothY += (y - smoothY) * smoothFactor;

  if (currentTool === 'scratch'){
    ctx.globalCompositeOperation = "destination-out";

    const size = 25;
    const half = size / 2;

    const dx = smoothX - lastX;
    const dy = smoothY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    // 거친 선 여러 개 긋기
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

    // 랜덤 점 찍기
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

  else if (currentTool === 'erase'){
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 25;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(smoothX, smoothY);
    ctx.stroke();
  }

  else if (currentTool === 'draw'){
    ctx.globalCompositeOperation = "source-over";
    const size = 30;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const img = shapeImgs[shape];
    if (img.complete){
      ctx.drawImage(img, smoothX - size/2, smoothY - size/2, size, size);
    }
  }

  lastX = smoothX;
  lastY = smoothY;
}
