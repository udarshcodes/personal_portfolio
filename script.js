const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      nav.classList.remove("open");
    });
  });
}


const canvas = document.getElementById("bg-dots");

if (canvas && canvas.getContext) {
  const ctx = canvas.getContext("2d");
  const FLAKE_COUNT = 120;
  const flakes = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initFlakes() {
    flakes.length = 0;
    for (let i = 0; i < FLAKE_COUNT; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 2,        
       
        speedY: Math.random() * 0.25 + 0.08,
        sway: Math.random() * 1.5 + 0.3,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const t = Date.now() / 3000;

    flakes.forEach(f => {
      
      f.y += f.speedY;
      f.x += Math.sin(t + f.offset) * f.sway;

  
      if (f.y > canvas.height + 10) {
        f.y = -10;
        f.x = Math.random() * canvas.width;
      }
      if (f.x < -10) f.x = canvas.width + 10;
      if (f.x > canvas.width + 10) f.x = -10;


      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = "rgba(110, 231, 183, 1)";
      ctx.shadowColor = "rgba(110, 231, 183, 0.9)";
      ctx.shadowBlur = 15;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  function startSnow() {
    resizeCanvas();
    initFlakes();
    draw();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initFlakes();
  });

  startSnow();
}


const badgeWrapper = document.querySelector(".badge-track-wrapper");
const badgeTrack = document.querySelector(".badge-track");
const btnPrev = document.querySelector(".badge-nav-btn.prev");
const btnNext = document.querySelector(".badge-nav-btn.next");

if (badgeWrapper && badgeTrack) {
  const scrollAmount = () => badgeWrapper.clientWidth * 0.7;

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      badgeWrapper.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      badgeWrapper.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });
  }


  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let activePointerId = null;

  badgeWrapper.addEventListener("pointerdown", e => {
    isDown = true;
    activePointerId = e.pointerId;
    badgeWrapper.setPointerCapture(activePointerId);
    badgeWrapper.classList.add("dragging");
    startX = e.clientX;
    scrollStart = badgeWrapper.scrollLeft;
  });

  badgeWrapper.addEventListener("pointermove", e => {
    if (!isDown || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    badgeWrapper.scrollLeft = scrollStart - dx;
  });

  const endDrag = e => {
    if (e.pointerId !== activePointerId) return;
    isDown = false;
    badgeWrapper.classList.remove("dragging");
    try {
      badgeWrapper.releasePointerCapture(activePointerId);
    } catch (_) {}
    activePointerId = null;
  };

  badgeWrapper.addEventListener("pointerup", endDrag);
  badgeWrapper.addEventListener("pointercancel", endDrag);
}
