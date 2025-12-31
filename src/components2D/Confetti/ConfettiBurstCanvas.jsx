import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcbef",
  "#6bff95", "#d77bff", "#ff9f43"
];

export default function ConfettiBurstCanvas({ trigger }) {
  const canvasRef = useRef(null);
  const burstsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function createBurst() {
      const x = w / 2;
      const y = h / 2;

      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;

        burstsRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 80,
          size: Math.random() * 6 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI
        });
      }
    }

    if (trigger) createBurst();

    function animate() {
      ctx.clearRect(0, 0, w, h);

      burstsRef.current = burstsRef.current.filter(p => p.life > 0);

      burstsRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life--;
        p.rotation += 0.2;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, [trigger]);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}

const canvasStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 4,
  pointerEvents: "none"
};
