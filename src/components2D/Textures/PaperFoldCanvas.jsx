/*
EASY CUSTOMIZATION:
- Softer folds: change 12 → 6
- More dramatic folds: change 12 → 20
- Fold density: change 0.015
- Paper color: change rgba values
*/

import { useEffect, useRef } from "react";

export default function PaperFoldCanvas() {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let t = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e) {
      pointer.current = { x: e.clientX, y: e.clientY, active: true };
    }
    function onLeave() {
      pointer.current.active = false;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.01;

      for (let y = 0; y < h; y += 3) {
        const fold =
          Math.sin(y * 0.015 + t) * 12 +
          (pointer.current.active
            ? Math.sin((y - pointer.current.y) * 0.03) * 10
            : 0);

        const shade = fold * 1.2;

        ctx.fillStyle = `rgba(${240 + shade},${235 + shade},${230 + shade},0.85)`;
        ctx.fillRect(0, y + fold * 0.3, w, 3);
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
}


