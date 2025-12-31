import { useEffect, useRef } from "react";

export default function ConfettiTextureCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let dots = [];

    const COLORS = ["#ffd93d", "#ff6b6b", "#6bcbef", "#6bff95"];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    dots = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.2
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);

      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        mixBlendMode: "overlay"
      }}
    />
  );
}

/*
EASY CUSTOMIZATION:
- Less dots: change 140
- Softer look: reduce alpha
- Bigger dots: increase r
- Theme colors: edit COLORS array
*/
