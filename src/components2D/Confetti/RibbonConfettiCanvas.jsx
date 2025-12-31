import { useEffect, useRef } from "react";

export default function RibbonConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let time = 0;

    // SMALLER + CLEANER
    const RIBBON_COUNT = 18;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // 🎗️ Mini ribbon streamers
    const ribbons = Array.from({ length: RIBBON_COUNT }, () => ({
      x: Math.random() * w,
      y: -Math.random() * h,
      length: 80 + Math.random() * 70,     // ⬅ much shorter
      width: 6 + Math.random() * 4,        // ⬅ thinner
      speed: 0.5 + Math.random() * 0.5,    // smooth fall
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.01,
      twistFreq: 0.06 + Math.random() * 0.03, // tighter twist
      color: {
        r: 255,
        g: 190 + Math.random() * 40,
        b: 130 + Math.random() * 80
      }
    }));

    function drawRibbon(r) {
      for (let i = 0; i < r.length; i += 4) {
        const progress = i / r.length;

        const twist = Math.sin(i * r.twistFreq + time);
        const halfWidth = r.width * (0.6 + Math.abs(twist));

        const x =
          r.x +
          Math.sin(progress * 4 + r.sway + time) * 18 * (1 - progress);
        const y = r.y + i;

        const light = twist * 35;

        ctx.beginPath();
        ctx.moveTo(x - halfWidth, y);
        ctx.lineTo(x + halfWidth, y);
        ctx.strokeStyle = `rgba(
          ${r.color.r + light},
          ${r.color.g + light},
          ${r.color.b + light},
          0.85
        )`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      time += 0.02;

      ribbons.forEach(r => {
        r.y += r.speed;
        r.sway += r.swaySpeed;

        drawRibbon(r);

        if (r.y - r.length > h) {
          r.y = -r.length;
          r.x = Math.random() * w;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4,
        pointerEvents: "none"
      }}
    />
  );
}

/*
========================
🎛 EASY CUSTOMIZATION
========================

🎗️ More mini ribbons
→ RIBBON_COUNT = 24

🎈 Very subtle look
→ width: 4
→ alpha: 0.6

🎉 More party energy
→ speed: 0.8 + Math.random()

🌀 Extra twist
→ twistFreq: 0.09

🌈 Color themes
→ Gold: { r:255, g:215, b:150 }
→ Pink: { r:255, g:120, b:170 }
→ Blue: { r:160, g:210, b:255 }
*/
