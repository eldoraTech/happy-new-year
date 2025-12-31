import { useEffect, useRef } from "react";

export default function NewYear3D({ year = "2026" }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const textLayers = [
      { depth: 40, color: "#ffcc00" },
      { depth: 25, color: "#ff4ecd" },
      { depth: 10, color: "#4dd2ff" }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // smooth mouse motion (inertia)
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      textLayers.forEach((layer, i) => {
        const offsetX = smooth.current.x * layer.depth;
        const offsetY = smooth.current.y * layer.depth;

        ctx.font = `bold ${Math.min(canvas.width / 6, 120)}px Poppins`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowBlur = 40;
        ctx.shadowColor = layer.color;
        ctx.fillStyle = layer.color;

        ctx.fillText(
          `Happy New Year ${year}`,
          cx + offsetX,
          cy + offsetY + Math.sin(Date.now() / 800 + i) * 10
        );
      });

      requestAnimationFrame(draw);
    };

    draw();

    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [year]);

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.hint}>🖱️ Move your mouse</div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at bottom, #020024, #000)",
    overflow: "hidden",
    position: "relative"
  },
  canvas: {
    position: "absolute",
    inset: 0
  },
  hint: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#aaa",
    fontSize: "0.9rem",
    opacity: 0.8
  }
};
