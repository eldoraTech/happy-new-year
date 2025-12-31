// Change paper color const baseColor = { r: 240, g: 200, b: 220 }; // pink crepe 
// Softer wrinkles const wrinkleScale = 0.015; 
// Stronger pull interaction const rippleStrength = 45; 
// More translucency rgba(..., 0.7)

import { useEffect, useRef } from "react";

export default function CrepePaperCanvas() {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let time = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Pointer interaction
    function onMove(e) {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.active = true;
    }

    function onLeave() {
      pointer.current.active = false;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    function drawCrepe() {
      ctx.clearRect(0, 0, w, h);

      time += 0.008;

      const baseColor = { r: 245, g: 220, b: 200 }; // soft paper tone
      const wrinkleScale = 0.02;
      const rippleStrength = 30;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          // Base wrinkle noise
          let wrinkle =
            Math.sin(x * wrinkleScale + time) +
            Math.sin(y * wrinkleScale * 1.2 - time);

          // Pointer ripple
          let dx = x - pointer.current.x;
          let dy = y - pointer.current.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let ripple = 0;
          if (pointer.current.active && dist < 180) {
            ripple =
              Math.cos(dist * 0.05 - time * 4) *
              (1 - dist / 180) *
              rippleStrength;
          }

          // Height simulation
          const height = wrinkle * 12 + ripple;

          // Lighting from top-left
          const light = height * 0.8;

          // Grain noise
          const grain = (Math.random() - 0.5) * 12;

          const r = baseColor.r + light + grain;
          const g = baseColor.g + light + grain;
          const b = baseColor.b + light + grain;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
          ctx.fillRect(x, y, 2, 2);
        }
      }

      requestAnimationFrame(drawCrepe);
    }

    drawCrepe();

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
        pointerEvents: "none",
        mixBlendMode: "soft-light"
      }}
    />
  );
}
