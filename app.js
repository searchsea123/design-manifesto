document.addEventListener("DOMContentLoaded", function(){
  const canvas = document.getElementById("mask");
  const ctx = canvas.getContext("2d");
  let currentTool = "scratch";
  function resize(){
    const prev = ctx.getImageData(0,0,canvas.width,canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(prev && prev.data) {
      ctx.putImageData(prev,0,0);
    }
  }
  resize();
  window.addEventListener("resize", resize);
  document.querySelectorAll(".tool-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tool-btn").forEach(b=>b.classList.remove("active"));
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
  canvas.addEventListener("mousedown", e=>{
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
    smoothX = lastX;
    smoothY = lastY;
  });
  canvas.addEventListener("mouseup", ()=>drawing = false);
  canvas.addEventListener("mouseleave", ()=>drawing = false);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("touchstart", e=>{
    e.preventDefault();
    drawing = true;
    const t = e.touches[0];
    lastX = t.clientX;
    lastY = t.clientY;
    smoothX = lastX;
    smoothY = lastY;
  }, {passive:false});
  canvas.addEventListener("touchend", e=>{
    e.preventDefault();
    drawing = false;
  });
  canvas.addEventListener("touchmove", e=>{
    e.preventDefault();
    const t = e.touches[0];
    draw({clientX: t.clientX, clientY: t.clientY});
  }, {passive:false});
  function draw(e){
    if(!drawing) return;
    const x = e.clientX;
    const y = e.clientY;
    smoothX += (x - smoothX) * smoothFactor;
    smoothY += (y - smoothY) * smoothFactor;
    if(currentTool === "scratch"){
      ctx.globalCompositeOperation = "destination-out";
      const size = 25;
      const half = size/2;
      const dx = smoothX - lastX;
      const dy = smoothY - lastY;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const dirX = dx / dist;
      const dirY = dy / dist;
      const lineCount = 6;
      for(let i=0;i<lineCount;i++){
        const offset = (Math.random()-0.5) * size * 0.7;
        ctx.lineWidth = Math.random()*0.7 + 0.3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(lastX + dirY*offset, lastY - dirX*offset);
        ctx.lineTo(smoothX + dirY*offset, smoothY - dirX*offset);
        ctx.stroke();
      }
      const dotCount = 25;
      for(let i=0;i<dotCount;i++){
        const angle = Math.random()*Math.PI*2;
        const radius = Math.random()*half;
        const px = smoothX + Math.cos(angle)*radius;
        const py = smoothY + Math.sin(angle)*radius;
        ctx.beginPath();
        ctx.arc(px, py, Math.random()*1.2, 0, Math.PI*2);
        ctx.fill();
      }
    } else if(currentTool === "erase"){
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 25;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(smoothX, smoothY);
      ctx.stroke();
    } else if(currentTool === "draw"){
      ctx.globalCompositeOperation = "source-over";
      const size = 30;
      const r = Math.random();
      if(r < 0.33){
        ctx.beginPath();
        ctx.arc(smoothX, smoothY, size/2, 0, Math.PI*2);
        ctx.fillStyle = "black";
        ctx.fill();
      } else if(r < 0.66){
        ctx.fillStyle = "black";
        ctx.fillRect(smoothX - size/2, smoothY - size/2, size, size);
      } else {
        ctx.beginPath();
        ctx.moveTo(smoothX, smoothY - size/2);
        ctx.lineTo(smoothX - size/2, smoothY + size/2);
        ctx.lineTo(smoothX + size/2, smoothY + size/2);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
      }
    }
    lastX = smoothX;
    lastY = smoothY;
  }
});
