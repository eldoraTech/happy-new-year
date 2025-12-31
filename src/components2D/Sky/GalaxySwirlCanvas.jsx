import { useEffect, useRef } from "react";

export default function GalaxySwirlCanvas({
  width = "100%",
  height = "100%",
  starCount = 1200,
  swirlStrength = 2.2,
  rotationSpeed = 0.0008,
  zIndex = 1,       // default behind everything
  position = "fixed" // can be 'absolute' if you want it inside a container
}) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    // Create stars
    starsRef.current = Array.from({ length: starCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() ** 0.6;
      return {
        angle,
        radius,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        twinkle: Math.random() * 0.02 + 0.005
      };
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background (transparent if you want to layer over other content)
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const minSide = Math.min(canvas.width, canvas.height) * 0.45;

      starsRef.current.forEach(star => {
        star.angle += rotationSpeed * (1 + star.radius * swirlStrength);

        // Twinkle
        star.alpha += star.twinkle * (Math.random() > 0.5 ? 1 : -1);
        star.alpha = Math.max(0.2, Math.min(1, star.alpha));

        const spiralRadius = star.radius * minSide;
        const x = cx() + Math.cos(star.angle + star.radius * swirlStrength) * spiralRadius;
        const y = cy() + Math.sin(star.angle + star.radius * swirlStrength) * spiralRadius;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [starCount, swirlStrength, rotationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        display: "block",
        position,
        top: 0,
        left: 0,
        pointerEvents: "none", // allow clicks through
        zIndex
      }}
    />
  );
}
