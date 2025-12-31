import { useRef, useEffect } from "react";

export default function BorderLightsCanvas({
  bulbSpacingDesktop = 60,
  bulbSpacingMobile = 40,
  marginDesktop = 20,
  marginMobile = 14,
  speed = 1 // 🔥 MASTER SPEED CONTROL (0.4 slow → 2.5 very fast)
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    let bulbs = [];
    let tick = 0;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createBulbs();
    }

    function createBulbs() {
      bulbs = [];

      const isMobile = window.innerWidth < 768;
      const spacing = isMobile ? bulbSpacingMobile : bulbSpacingDesktop;
      const margin = isMobile ? marginMobile : marginDesktop;
      const radiusBase = isMobile ? 3 : 5;
      const speedFactor = isMobile ? 0.7 : 1;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const colors = ["#00ffff", "#ffd966", "#ff6b6b", "#7cff7c"];

      // Top
      for (let x = margin; x <= w - margin; x += spacing)
        bulbs.push({ x, y: margin });

      // Right
      for (let y = margin; y <= h - margin; y += spacing)
        bulbs.push({ x: w - margin, y });

      // Bottom
      for (let x = w - margin; x >= margin; x -= spacing)
        bulbs.push({ x, y: h - margin });

      // Left
      for (let y = h - margin; y >= margin; y -= spacing)
        bulbs.push({ x: margin, y });

      bulbs.forEach(b => {
        b.radius = radiusBase + Math.random() * 1.5;
        b.phase = Math.random() * Math.PI * 2;
        b.speed = (0.08 + Math.random() * 0.12) * speedFactor;
        b.color = colors[Math.floor(Math.random() * colors.length)];
      });
    }

    function drawWire(a, b) {
      ctx.strokeStyle = "rgba(120,120,120,0.6)";
      ctx.lineWidth = 1;
      const sag = 6;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2 + sag,
        b.x,
        b.y
      );
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick += speed;

      // 🔗 WIRES
      for (let i = 0; i < bulbs.length - 1; i++) {
        drawWire(bulbs[i], bulbs[i + 1]);
      }

      // 💡 BULBS
      bulbs.forEach((b, i) => {
        b.phase += b.speed * speed;

        // FAST ON / OFF + MOVING PATTERN
        const chase =
          Math.sin((tick + i * 6) * 0.18 * speed) > 0 ? 1 : 0.15;

        const glow = (0.6 + Math.sin(b.phase) * 0.4) * chase;

        const gradient = ctx.createRadialGradient(
          b.x, b.y, 0,
          b.x, b.y, b.radius * 7
        );

        gradient.addColorStop(0, `${b.color}${Math.floor(glow * 255).toString(16).padStart(2, "0")}`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => window.removeEventListener("resize", resize);
  }, [
    bulbSpacingDesktop,
    bulbSpacingMobile,
    marginDesktop,
    marginMobile,
    speed
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10
      }}
    />
  );
}
