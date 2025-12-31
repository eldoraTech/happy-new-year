import { useEffect, useRef } from "react";

const RIBBON_COLORS = [
  { r: 255, g: 215, b: 150 },
  { r: 255, g: 120, b: 160 },
  { r: 160, g: 200, b: 255 }
];

export default function GiftOpeningCanvas() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let state = "closed"; // closed → unwrap → opening → opened
    let progress = 0;
    let glow = 0;
    let ribbonConfetti = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const box = {
      size: 140,
      x: () => w / 2,
      y: () => h / 2 + 80
    };

    /* 🔊 SOUND */
    audioRef.current = new Audio("/unwrap.mp3"); // place file in public/

    /* 🎗 RIBBON CONFETTI */
    function ribbonBurst(x, y) {
      for (let i = 0; i < 14; i++) {
        const c = RIBBON_COLORS[Math.floor(Math.random() * RIBBON_COLORS.length)];
        ribbonConfetti.push({
          x,
          y,
          yOffset: 0,
          length: 80 + Math.random() * 60,
          width: 6 + Math.random() * 4,
          speed: 0.8 + Math.random() * 0.6,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.03 + Math.random() * 0.02,
          twist: Math.random() * 0.06 + 0.04,
          color: c
        });
      }
    }

    function handleClick() {
      if (state === "closed") {
        state = "unwrap";
        audioRef.current?.play().catch(() => {});
      }
    }

    window.addEventListener("click", handleClick);

    function drawBox() {
      const s = box.size;
      const cx = box.x();
      const cy = box.y();

      const tilt = state !== "closed" ? Math.sin(progress * Math.PI) * 0.05 : 0;
      const capUp = state === "opening" || state === "opened" ? -progress * 140 : 0;
      const boxDown = state === "opening" || state === "opened" ? progress * 120 : 0;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // 📦 BOX BODY
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(-s / 2, -s / 2 + boxDown, s, s);

      // 🎀 RIBBON (unwrap animation)
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, -s / 2 + boxDown);
      ctx.lineTo(
        0 + (state === "unwrap" ? progress * 60 : 0),
        s / 2 + boxDown
      );
      ctx.stroke();

      ctx.restore();

      // 🧢 CAP
      ctx.save();
      ctx.translate(cx, cy - s / 2 + capUp);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(-s / 2, -s / 4, s, s / 3);
      ctx.restore();
    }

    function drawGlow() {
      if (glow <= 0) return;
      const cx = box.x();
      const cy = box.y() - box.size / 2;

      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 160);
      grd.addColorStop(0, `rgba(255,255,200,${glow})`);
      grd.addColorStop(1, "rgba(255,255,200,0)");

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    }

    function drawRibbonConfetti() {
      ribbonConfetti.forEach(r => {
        for (let i = 0; i < r.length; i += 4) {
          const twist = Math.sin(i * r.twist + r.sway);
          const half = r.width * (0.6 + Math.abs(twist));

          const x = r.x + Math.sin(r.sway + i * 0.04) * 18;
          const y = r.y + i + r.yOffset;

          const light = twist * 40;

          ctx.beginPath();
          ctx.moveTo(x - half, y);
          ctx.lineTo(x + half, y);
          ctx.strokeStyle = `rgba(
            ${r.color.r + light},
            ${r.color.g + light},
            ${r.color.b + light},
            0.9
          )`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }

        r.yOffset += r.speed;
        r.sway += r.swaySpeed;
      });

      ribbonConfetti = ribbonConfetti.filter(r => r.yOffset < h);
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      if (state === "unwrap") {
        progress += 0.03;
        if (progress >= 1) {
          progress = 0;
          state = "opening";
          glow = 1;
          ribbonBurst(box.x(), box.y() - box.size / 2);
        }
      }

      if (state === "opening") {
        progress += 0.025;
        glow *= 0.96;
        if (progress >= 1) state = "opened";
      }

      drawGlow();
      drawBox();
      drawRibbonConfetti();

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5,
        pointerEvents: "auto"
      }}
    />
  );
}

/*
================================================
🎛 EASY CUSTOMIZATION
================================================

🎀 Ribbon unwrap speed
→ progress += 0.03

🧢 Cap lift distance
→ capUp = -progress * 180

📦 Box drop distance
→ boxDown = progress * 150

✨ Glow intensity
→ glow = 1.5

🎗 Ribbon confetti count
→ ribbonBurst loop (14 → 24)

🔊 Sound file
→ replace /unwrap.mp3

🎨 Color themes
→ change RIBBON_COLORS
================================================
*/
