import { useEffect, useRef } from "react";

export default function GlitterTextureCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.twinkle += p.speed;
        const alpha = 0.2 + Math.sin(p.twinkle) * 0.3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
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
        mixBlendMode: "screen"
      }}
    />
  );
}

/*
EASY CUSTOMIZATION:
- More glitter: change 180
- Bigger sparkle: change r range
- Faster shimmer: increase speed
- Gold glitter: use rgba(255,215,150,…)
*/
