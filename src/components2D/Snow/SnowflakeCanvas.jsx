// More snowflakes:    const FLAKE_COUNT = 150;
// Bigger flakes:   size: Math.random() * 16 + 14
// Slower snow:   speed: Math.random() * 0.4 + 0.2

import { useEffect, useRef } from "react";

export default function SnowflakeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let flakes = [];

    const FLAKE_COUNT = 100;
    const FLAKE_CHAR = "❅";
    // const FLAKE_CHAR = "❄️";
    // const FLAKE_CHAR = "⚙️";

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createFlakes() {
      flakes = Array.from({ length: FLAKE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 10,
        speed: Math.random() * 0.6 + 1.4,
        drift: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.01 - 0.005,
        opacity: Math.random() * 0.5 + 0.4
      }));
    }

    createFlakes();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      flakes.forEach((f) => {
        f.y += f.speed;
        f.x += f.drift;
        f.rotation += f.rotationSpeed;

        if (f.y > height + 20) {
          f.y = -20;
          f.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.font = `${f.size}px serif`;
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(FLAKE_CHAR, 0, 0);
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
        zIndex: 2,
        pointerEvents: "none"
      }}
    />
  );
}
