document.addEventListener("DOMContentLoaded",function(){
  const canvas=document.getElementById("mask");
  const ctx=canvas.getContext("2d");
  let currentTool="scratch";
  function makeStampCircle(size,color){
    const c=document.createElement("canvas");
    c.width=c.height=size;
    const g=c.getContext("2d");
    g.fillStyle=color;
    g.beginPath();
    g.arc(size/2,size/2,size/2,0,Math.PI*2);
    g.fill();
    const img=new Image();
    img.src=c.toDataURL();
    return img;
  }
  function makeStampSquare(size,color){
    const c=document.createElement("canvas");
    c.width=c.height=size;
    const g=c.getContext("2d");
    g.fillStyle=color;
    g.fillRect(0,0,size,size);
    const img=new Image();
    img.src=c.toDataURL();
    return img;
  }
  function makeStampTriangle(size,color){
    const c=document.createElement("canvas");
    c.width=c.height=size;
    const g=c.getContext("2d");
    g.fillStyle=color;
    g.beginPath();
    g.moveTo(size/2,0);
    g.lineTo(0,size);
    g.lineTo(size,size);
    g.closePath();
    g.fill();
    const img=new Image();
    img.src=c.toDataURL();
    return img;
  }
  const stampSize=30;
  const stamps=[makeStampCircle(stampSize,"black"),makeStampSquare(stampSize,"black"),makeStampTriangle(stampSize,"black")];
  function initCanvas(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  initCanvas();
  window.addEventListener("resize",function(){
    const temp=document.createElement("canvas");
    temp.width=canvas.width;
    temp.height=canvas.height;
    temp.getContext("2d").drawImage(canvas,0,0);
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(temp,0,0);
  });
  document.querySelectorAll(".tool-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".tool-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      currentTool=btn.dataset.tool;
    });
  });
  let drawing=false;
  let lastX=0;
  let lastY=0;
  let smoothX=0;
  let smoothY=0;
  const smoothFactor=0.25;
  let stampAccumulator=0;
  function getPos(e){
    if(e.touches) return {x:e.touches[0].clientX,y:e.touches[0].clientY};
    return {x:e.clientX,y:e.clientY};
  }
  canvas.addEventListener("mousedown",e=>{
    drawing=true;
    const p=getPos(e);
    lastX=p.x;
    lastY=p.y;
    smoothX=lastX;
    smoothY=lastY;
    stampAccumulator=0;
  });
  canvas.addEventListener("touchstart",e=>{
    e.preventDefault();
    drawing=true;
    const p=getPos(e);
    lastX=p.x;
    lastY=p.y;
    smoothX=lastX;
    smoothY=lastY;
    stampAccumulator=0;
  },{passive:false});
  canvas.addEventListener("mouseup",()=>drawing=false);
  canvas.addEventListener("mouseleave",()=>drawing=false);
  canvas.addEventListener("touchend",e=>{e.preventDefault();drawing=false;},{passive:false});
  canvas.addEventListener("mousemove",move);
  canvas.addEventListener("touchmove",e=>{e.preventDefault();move({clientX:e.touches[0].clientX,clientY:e.touches[0].clientY});},{passive:false});
  function move(e){
    if(!drawing) return;
    const x=e.clientX;
    const y=e.clientY;
    smoothX += (x - smoothX) * smoothFactor;
    smoothY += (y - smoothY) * smoothFactor;
    if(currentTool==="scratch"){
      ctx.globalCompositeOperation="destination-out";
      const size=25;
      const half=size/2;
      const dx=smoothX-lastX;
      const dy=smoothY-lastY;
      const dist=Math.sqrt(dx*dx+dy*dy)||1;
      const dirX=dx/dist;
      const dirY=dy/dist;
      const lineCount=8;
      for(let i=0;i<lineCount;i++){
        const offset=(Math.random()-0.5)*size*0.9;
        ctx.lineWidth=Math.random()*0.8+0.3;
        ctx.lineCap="round";
        ctx.beginPath();
        ctx.moveTo(lastX+dirY*offset,lastY-dirX*offset);
        ctx.lineTo(smoothX+dirY*offset,smoothY-dirX*offset);
        ctx.stroke();
      }
      const dotCount=35;
      for(let i=0;i<dotCount;i++){
        const angle=Math.random()*Math.PI*2;
        const radius=Math.random()*half;
        const px=smoothX+Math.cos(angle)*radius;
        const py=smoothY+Math.sin(angle)*radius;
        ctx.beginPath();
        ctx.arc(px,py,Math.random()*1.3,0,Math.PI*2);
        ctx.fill();
      }
    } else if(currentTool==="erase"){
      ctx.globalCompositeOperation="destination-out";
      ctx.lineWidth=25;
      ctx.lineCap="round";
      ctx.beginPath();
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(smoothX,smoothY);
      ctx.stroke();
    } else if(currentTool==="draw"){
      ctx.globalCompositeOperation="source-over";
      const spacing=28;
      const dx=smoothX-lastX;
      const dy=smoothY-lastY;
      const segDist=Math.sqrt(dx*dx+dy*dy);
      stampAccumulator+=segDist;
      if(stampAccumulator>=spacing||stampAccumulator===0){
        const count=Math.floor(stampAccumulator/spacing);
        for(let i=0;i<count;i++){
          const t=(i+1)/count;
          const px=lastX+(smoothX-lastX)*t;
          const py=lastY+(smoothY-lastY)*t;
          const s=stamps[Math.floor(Math.random()*stamps.length)];
          if(s.complete){
            ctx.drawImage(s,px-stampSize/2,py-stampSize/2,stampSize,stampSize);
          }
        }
        stampAccumulator=stampAccumulator%spacing;
      }
    }
    lastX=smoothX;
    lastY=smoothY;
  }
});
