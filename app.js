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

  // 부드러운 지우개 설정
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = eraseSize;

  lastX = e.clientX;
  lastY = e.clientY;
}

function draw(e) {
  if (!drawing) return;

  const x = e.clientX;
  const y = e.clientY;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
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
