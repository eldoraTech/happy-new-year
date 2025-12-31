import { useEffect, useRef } from "react";

const COLORS = [
  "255, 215, 150", // gold
  "255, 99, 132",  // red
  "54, 162, 235",  // blue
  "153, 102, 255", // purple
  "255, 159, 64",  // orange
  "75, 192, 192"   // teal
];

export default function MultiLayerFireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let particles = [];

    const AUTO_FIRE_INTERVAL = 2600;
    const CORE_PARTICLES = 30;
    const RING_PARTICLES = 90;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // MULTI-LAYER FIREWORK
    function firework(x, y) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      // CORE BURST
      for (let i = 0; i < CORE_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3.5,
          life: 60,
          alpha: 1,
          color
        });
      }

      // OUTER RING
      for (let i = 0; i < RING_PARTICLES; i++) {
        const angle = (Math.PI * 2 * i) / RING_PARTICLES;
        const speed = Math.random() * 4 + 3;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2,
          life: 80,
          alpha: 1,
          color
        });
      }
    }

    // AUTO FIREWORKS
    const autoFire = setInterval(() => {
      firework(
        Math.random() * width,
        Math.random() * height * 0.35 + 60
      );
    }, AUTO_FIRE_INTERVAL);

    // CLICK / TAP
    function handleClick(e) {
      firework(e.clientX, e.clientY);
    }

    window.addEventListener("click", handleClick);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;
        p.life--;
        p.alpha -= 0.012;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      clearInterval(autoFire);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  );
}
