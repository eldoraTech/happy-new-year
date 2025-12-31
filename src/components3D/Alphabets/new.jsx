import { useEffect, useRef } from "react";

export default function HappyNewYear2026() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    let t = 0;

    function draw() {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const dist =
          Math.hypot(mouse.current.x - p.x, mouse.current.y - p.y) / 150;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + Math.max(0, 2 - dist), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      });

      // Glowing text
      const pulse = Math.sin(t) * 10;
      ctx.font = `bold ${Math.min(canvas.width / 8, 110) + pulse}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = "#00eaff";
      ctx.shadowBlur = 40;

      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "Happy New Year",
        canvas.width / 2,
        canvas.height / 2 - 60
      );

      ctx.font = `bold ${Math.min(canvas.width / 6, 150) + pulse}px Arial`;
      ctx.fillStyle = "#00eaff";
      ctx.fillText("2026", canvas.width / 2, canvas.height / 2 + 80);

      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}
