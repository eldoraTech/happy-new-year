import { useRef, useEffect } from "react";

export default function InteractiveNumber({
  value = "?",
  size = 80,
  width = size,
  height = size,
  fontSize = size,
  depth = 24,
  step = 3,
  colors = {
    front: "#00ffffff",
    depth1: "#ffffffff"
  }
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let tiltX = 0;
    let tiltY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.font = `${fontSize}px Arial Black`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const steps = 2;

      /* ===== DEPTH ===== */
      for (let i = steps; i >= 1; i--) {
        ctx.fillStyle = colors.depth1;
        ctx.fillText(
          value,
          cx + i * step + tiltX,
          cy + i * step + tiltY
        );
      }

      /* ===== FRONT FACE ===== */
      ctx.save();
      ctx.shadowColor = colors.front;
      ctx.shadowBlur = 25;
      ctx.fillStyle = colors.front;
      ctx.fillText(
        value,
        cx + tiltX,
        cy + tiltY
      );
      ctx.restore();
    };

    draw();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;

      tiltX = x * 0.05;
      tiltY = y * 0.05;

      draw();
    };

    const handleMouseLeave = () => {
      tiltX = 0;
      tiltY = 0;
      draw();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [value, width, height, fontSize, depth, step, colors]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", backgroundColor: "transparent" }}
    />
  );
}
