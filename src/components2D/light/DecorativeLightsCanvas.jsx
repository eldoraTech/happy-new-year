import { useRef, useEffect } from "react";

export default function DecorativeLightsCanvas({
  bulbCount = 24,
  wireHeight = 40,   // higher for better visibility on mobile
  zIndex = 10,       // background by default
  position = "fixed" // can be 'absolute' if needed
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

    // Create bulbs
    const bulbs = Array.from({ length: bulbCount }).map((_, i) => ({
      xRatio: (i + 1) / (bulbCount + 1),
      phase: Math.random() * Math.PI * 2,
      radius: 5 + Math.random() * 3,
      color: ["#00ffff", "#ffd966", "#ff6b6b", "#7cff7c"][
        Math.floor(Math.random() * 4)
      ]
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // ===== WIRE =====
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, wireHeight);

      bulbs.forEach(b => {
        const x = w * b.xRatio;
        ctx.quadraticCurveTo(
          x,
          wireHeight + 20,
          x,
          wireHeight
        );
      });

      ctx.lineTo(w, wireHeight);
      ctx.stroke();

      // ===== BULBS =====
      bulbs.forEach(b => {
        const x = w * b.xRatio;
        const y = wireHeight;

        // Infinite glowing effect
        b.phase += 0.03;
        const glow = 0.5 + 0.5 * Math.sin(b.phase); // 0.0 - 1.0

        const gradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, b.radius * 8
        );

        gradient.addColorStop(0, `${b.color}${Math.floor(glow * 255).toString(16).padStart(2,"0")}`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, b.radius * 8, 0, Math.PI * 2);
        ctx.fill();

        // Bulb core
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(x, y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, [bulbCount, wireHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex,
      }}
    />
  );
}
