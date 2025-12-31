import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcbef",
  "#6bff95", "#d77bff", "#ff9f43"
];

export default function ConfettiBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let pieces = [];
    const COUNT = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    pieces = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 1 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2
    }));

    function animate() {
      ctx.clearRect(0, 0, w, h);

      pieces.forEach(p => {
        p.y += p.speed;
        p.rotation += 0.02;

        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}

const canvasStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 2,
  pointerEvents: "none"
};
