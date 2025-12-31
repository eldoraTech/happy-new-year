import { useEffect, useRef } from "react";

export default function RibbonCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let time = 0;

    // Ribbon settings
    const RIBBON_COUNT = 3;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Create ribbons
    const ribbons = Array.from({ length: RIBBON_COUNT }, (_, i) => ({
      baseX: Math.random() * w,
      speed: 0.3 + Math.random() * 0.2,
      amplitude: 60 + Math.random() * 40,
      width: 18 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      color: { r: 245, g: 215, b: 170 } // paper-gold ribbon
    }));

    function drawRibbon(r) {
      ctx.beginPath();

      for (let y = -40; y < h + 40; y += 6) {
        const twist = Math.sin(y * 0.04 + time + r.phase);
        const x = r.baseX + Math.sin(y * 0.01 + time) * r.amplitude;

        const halfWidth = r.width * (0.6 + Math.abs(twist) * 0.8);

        ctx.moveTo(x - halfWidth, y);
        ctx.lineTo(x + halfWidth, y);

        // Fake 3D lighting (front/back)
        const light = 40 * twist;
        ctx.strokeStyle = `rgba(
          ${r.color.r + light},
          ${r.color.g + light},
          ${r.color.b + light},
          0.9
        )`;

        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      time += 0.015;

      ribbons.forEach(r => {
        r.baseX += Math.sin(time * r.speed) * 0.3;
        drawRibbon(r);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none"
      }}
    />
  );
}

/*
========================
EASY CUSTOMIZATION
========================

1️⃣ More ribbons
→ change RIBBON_COUNT (3 → 6)

2️⃣ Thicker ribbon
→ width: 18 → 26

3️⃣ Stronger twist (more 3D)
→ change 0.04 in Math.sin(y * 0.04)

4️⃣ Wider wave
→ amplitude: 60 → 100

5️⃣ Color theme
→ color: { r: 255, g: 100, b: 120 } // pink ribbon
→ color: { r: 200, g: 220, b: 255 } // blue ribbon

6️⃣ Faster motion
→ time += 0.025
*/
