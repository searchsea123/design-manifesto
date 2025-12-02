const canvas = document.getElementById("mask");
const ctx = canvas.getContext("2d");
const eraser = document.getElementById("eraser");

// 전체 화면 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 처음 전체를 검정으로 덮기
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;
let eraseSize = Number(eraser.value);

let lastX = 0;
let lastY = 0;

// --- 손떨림 방지용 스무딩 변수 ---
let smoothX = 0;
let smoothY = 0;
const smoothFactor = 0.2; // 값이 낮을수록 더 부드러움(0.15~0.25 추천)

// 지우개 크기 조절
eraser.addEventListener("input", () => {
  eraseSize = Number(eraser.value);
});

// ------------ 마우스 이벤트 ------------
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", end);
canvas.addEventListener("mousemove", draw);

function start(e) {
  drawing = true;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = eraseSize;

  lastX = e.clientX;
  lastY = e.clientY;

  // 스무딩 초기화
  smoothX = lastX;
  smoothY = lastY;
}

function draw(e) {
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY;

  // 좌표 스무딩(손떨림 방지)
  smoothX = smoothX + (x - smoothX) * smoothFactor;
  smoothY = smoothY + (y - smoothY) * smoothFactor;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(smoothX, smoothY);
  ctx.stroke();

  lastX = smoothX;
  lastY = smoothY;
}

function end() {
  drawing = false;
  ctx.beginPath();
}


function drawTouch(e){
  if (!drawing) return;

  const t = e.touches[0];

  ctx.lineTo(t.clientX, t.clientY);
  ctx.stroke();
  e.preventDefault(); // 모바일 브라우저 스크롤 방지
}
