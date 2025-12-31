import { useEffect, useRef } from "react";

export default function TwinklingSkyCanvas({
  width = "100%",
  height = "100vh",
  starCountDesktop = 180,
  starCountMobile = 90
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? starCountMobile : starCountDesktop;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    }));

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha >= 1 || star.alpha <= 0) {
          star.speed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [starCountDesktop, starCountMobile]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        display: "block",
        background: "black"
      }}
    />
  );
}
