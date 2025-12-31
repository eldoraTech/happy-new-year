import { useRef, useEffect } from "react";

export default function GlowingStarsCanvas({
  width = "100%",
  height = "100%",
  starCount = 120
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005
    }));

    function drawStar(star) {
      const { x, y, radius, alpha } = star;

      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 8);
      glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
      glow.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.3})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      ctx.moveTo(x - radius * 6, y);
      ctx.lineTo(x + radius * 6, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y - radius * 6);
      ctx.lineTo(x, y + radius * 6);
      ctx.stroke();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha >= 1 || star.alpha <= 0) star.speed *= -1;
        drawStar(star);
      });
      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resize);
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        width,
        height,
        // background: "black",
        pointerEvents: "none"
      }}
    />
  );
}
