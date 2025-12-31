import { useEffect, useRef } from "react";

export default function SparkleSnowCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let flakes = [];

    const FLAKE_COUNT = 100;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    flakes = Array.from({ length: FLAKE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      glow: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.2
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      flakes.forEach(f => {
        f.y += f.speed;
        f.glow += 0.04;

        if (f.y > height) {
          f.y = -10;
          f.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(f.glow) * 0.3})`;
        ctx.fill();
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
        zIndex: 2,
        pointerEvents: "none"
      }}
    />
  );
}
