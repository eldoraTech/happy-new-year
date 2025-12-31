import { useEffect, useRef } from "react";

export default function NewYearUltraInteractive({
  text = "Happy New Year 2026!",
  width = "100%",
  height = "100vh",
  position = "absolute",
  zIndex = 100,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const time = useRef(0);
  const view = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    /* ---------- RESIZE ---------- */
    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      view.current.w = rect.width;
      view.current.h = rect.height;

      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);
    resize();

    /* ---------- WRAP TEXT (NO WORD GAP BUG) ---------- */
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      const lines = [];
      const spaceWidth = ctx.measureText(" ").width;

      let line = "";
      let lineWidth = 0;

      for (const word of words) {
        const wordWidth = ctx.measureText(word).width;

        if (lineWidth + wordWidth + (line ? spaceWidth : 0) > maxWidth) {
          lines.push(line);
          line = word;
          lineWidth = wordWidth;
        } else {
          line += (line ? " " : "") + word;
          lineWidth += wordWidth + (line ? spaceWidth : 0);
        }
      }

      if (line) lines.push(line);
      return lines;
    };

    /* ---------- DRAW ---------- */
    const draw = () => {
      time.current += 0.015;
      ctx.clearRect(0, 0, view.current.w, view.current.h);

      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      const { w, h } = view.current;

      const fontSize = Math.max(28, Math.min(w * 0.08, h * 0.14, 96));
      ctx.font = `900 ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.textRendering = "geometricPrecision";

      const maxTextWidth = w * 0.85;
      const lines = wrapText(text, maxTextWidth);

      // 👇 EXTRA GAP ONLY WHEN WRAPPED
      const baseLineHeight = fontSize * 1.15;
      const extraGap = lines.length > 1 ? fontSize * 0.35 : 0;
      const lineHeight = baseLineHeight + extraGap;

      const totalHeight = lines.length * lineHeight;
      const cx = w / 2;
      const startY = h / 2 - totalHeight / 2 + lineHeight / 2;

      const layers = w < 600 ? 22 : 40;

      for (let z = layers; z >= 0; z--) {
        const depth = z * 0.9;
        const wave = Math.sin(time.current + z * 0.15) * 10;

        ctx.shadowBlur = 14;
        ctx.shadowColor = `hsla(${200 + z * 2},100%,60%,0.6)`;
        ctx.fillStyle = `hsla(${200 + z * 2},100%,${45 + z * 0.7}%,0.9)`;

        lines.forEach((line, i) => {
          ctx.fillText(
            line,
            cx + smooth.current.x * depth * 0.6,
            startY +
              i * lineHeight +
              wave +
              smooth.current.y * depth * 0.6
          );
        });
      }

      requestAnimationFrame(draw);
    };

    draw();

    /* ---------- INPUT ---------- */
    const updateMouse = (x, y) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((x - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = ((y - rect.top) / rect.height - 0.5) * 2;
    };

    const onMouseMove = (e) => updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e) =>
      updateMouse(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        position,
        zIndex,
        overflow: "hidden",
        // background: "radial-gradient(circle at center, #020024, #000)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
