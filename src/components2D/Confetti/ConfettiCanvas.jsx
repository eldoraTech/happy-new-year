import { useEffect, useRef } from "react";

export default function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let confetti = [];
    const CONFETTI_COUNT = 5;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createConfetti() {
      confetti = Array.from({ length: CONFETTI_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        w: Math.random() * 4 + 2,     // confetti width
        h: Math.random() * 40 + 100,   // confetti height (increase here)
        speed: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI,
        rotationSpeed: Math.random() * 0.02,
        opacity: Math.random() * 0.5 + 0.3
      }));
    }

    createConfetti();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      confetti.forEach(p => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(245, 201, 122, ${p.opacity})`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2
      }}
    />
  );
}
