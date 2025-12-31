import { useEffect, useRef } from "react";

export default function FireworksStarsCanvas({
  width = "100%",
  height = "100%",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fireworks = [];

    function createFirework() {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height * 0.5;

      for (let i = 0; i < 80; i++) {
        fireworks.push({
          x: cx,
          y: cy,
          vx: Math.cos(i) * (Math.random() * 3),
          vy: Math.sin(i) * (Math.random() * 3),
          life: 60,
        });
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworks.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.fillStyle = `rgba(255,255,255,${p.life / 60})`;
        ctx.fillRect(p.x, p.y, 2, 2);

        if (p.life <= 0) fireworks.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    setInterval(createFirework, 1800);
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: "block" }}
    />
  );
}
