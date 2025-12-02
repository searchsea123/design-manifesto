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

// 지우개 크기 조절
eraser.addEventListener("input",()=>{
  eraseSize = Number(eraser.value);
});


// -------------마우스 이벤트-------------
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", end);
canvas.addEventListener("mousemove", draw);

function start(e){
  drawing = true;

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = eraseSize * 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

function draw(e){
  if (!drawing) return;

  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
}

function end(){
  drawing = false;
  ctx.beginPath();
}


// ------------------------------------
//           터치 이벤트
// ------------------------------------
canvas.addEventListener("touchstart", startTouch);
canvas.addEventListener("touchend", end);
canvas.addEventListener("touchmove", drawTouch);

function startTouch(e){
  drawing = true;

  const t = e.touches[0];

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = eraseSize * 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(t.clientX, t.clientY);
}

function drawTouch(e){
  if (!drawing) return;

  const t = e.touches[0];

  ctx.lineTo(t.clientX, t.clientY);
  ctx.stroke();
  e.preventDefault(); // 모바일 브라우저 스크롤 방지
}
