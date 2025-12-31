import { useEffect, useRef } from "react";

export default function ThreeDNumber({
  value = "?",
  size = 80,
  depth = 14,

  /* ===== NEW CONTROLS ===== */
  fontFamily = "Teko",
  fontWeight = 900,
  frontColor = "#FFD700",
  depthColor = "#FFEA85",
  depthOffset = 0.25
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const fontSize = size * 0.75;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const x = size / 2;
    const y = size / 2;

    /* ===== DEPTH ===== */
    ctx.fillStyle = depthColor;
    for (let i = depth; i > 0; i--) {
      ctx.fillText(
        value,
        x + i * depthOffset,
        y + i * depthOffset
      );
    }

    /* ===== FRONT ===== */
    ctx.fillStyle = frontColor;
    ctx.fillText(value, x, y);
  }, [
    value,
    size,
    depth,
    fontFamily,
    fontWeight,
    frontColor,
    depthColor,
    depthOffset
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        backgroundColor: "transparent"
      }}
    />
  );
}
