// More snow:           const SNOW_COUNT = 180;
// Bigger snow balls:   radius: Math.random() * 3 + 2
// Slower snow:         speed: Math.random() * 0.4 + 0.2

import { useEffect, useRef } from "react";

export default function SnowCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let snowflakes = [];

    const SNOW_COUNT = 120;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createSnow() {
      snowflakes = Array.from({ length: SNOW_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.5, // white balls
        speed: Math.random() * 0.6 + 0.3,
        drift: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.3
      }));
    }

    createSnow();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      snowflakes.forEach((s) => {
        s.y += s.speed;
        s.x += s.drift * 0.3;

        // reset when out of screen
        if (s.y > height + 10) {
          s.y = -10;
          s.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
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
