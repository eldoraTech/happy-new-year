import { useEffect, useRef } from "react";

export default function NewYearCanvas({
  width = "100%",
  height = "100%",
  year = "2026"
}) {
  const canvasRef = useRef(null);
  const timeRef = useRef(0);
  const introRef = useRef(0); // popup animation progress

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawExtrudedText({
      text,
      x,
      y,
      font,
      front,
      depth,
      layers = 18,
      dx = 1,
      dy = 1,
      scale = 1,
      alpha = 1
    }) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.translate(-x, -y);

      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = depth;
      for (let i = layers; i > 0; i--) {
        ctx.fillText(text, x + i * dx, y + i * dy);
      }

      ctx.fillStyle = front;
      ctx.fillText(text, x, y);

      ctx.restore();
    }

    function animate() {
      requestAnimationFrame(animate);

      timeRef.current += 0.02;
      introRef.current = Math.min(introRef.current + 0.04, 1);

      const t = timeRef.current;
      const easeOut = 1 - Math.pow(1 - introRef.current, 3);

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const base = Math.min(w, h);

      ctx.clearRect(0, 0, w, h); // 🔥 transparent background

      // Floating dance motion
      const float = Math.sin(t) * base * 0.008;
      const sway = Math.sin(t * 0.8) * 0.02;

      /* ===== HAPPY ===== */
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#af4eff";

      drawExtrudedText({
        text: "HAPPY",
        x: w / 2,
        y: h * 0.25 + float,
        font: `900 ${base * 0.14}px Arial Black`,
        front: "#9414fc",
        depth: "#a02cfe",
        layers: 4,
        scale: easeOut,
        alpha: easeOut
      });

      /* ===== New Year ===== */
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#2aff35";

      drawExtrudedText({
        text: "New Year",
        x: w / 2,
        y: h * 0.5 + float * 0.7,
        font: `${base * 0.09}px "Comic Sans MS", cursive`,
        front: "#ccf9cf",
        depth: "#129f35",
        layers: 3,
        scale: easeOut * (1 + sway),
        alpha: easeOut
      });

      /* ===== YEAR ===== */
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff2aa1";

      drawExtrudedText({
        text: year,
        x: w / 2,
        y: h * 0.75 + float * 1.2,
        font: `900 ${base * 0.24}px Arial Black`,
        front: "#ff2aa1",
        depth: "#9f1239",
        layers: 3,
        scale: easeOut * (1 - sway),
        alpha: easeOut
      });

      ctx.shadowBlur = 0;
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, [year]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        display: "block",
        background: "transparent" // 🔥 ensure transparency
      }}
    />
  );
}
