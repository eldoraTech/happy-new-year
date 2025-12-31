import { useEffect, useRef } from "react";

export default function ShootingStarsCanvas({
  width = "100%",
  height = "100%",
  starCount = 150,
  meteorCount = 60,
  speed = 0.4, // 0.2 = slow, 1 = fast
  zIndex = 1, // default behind everything
  position = "fixed", // can be 'absolute' or 'fixed'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    /* ---------- STARS ---------- */
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      alpha: Math.random(),
    }));

    /* ---------- METEORS ---------- */
    function createMeteor() {
      return {
        x: Math.random() * canvas.width * 1.2,
        y: Math.random() * canvas.height * 0.4,
        vx: (-10 - Math.random() * 6) * speed,
        vy: (5 + Math.random() * 3) * speed,
        length: 200 + Math.random() * 200,
        life: 0,
        maxLife: 90 + Math.random() * 40,
      };
    }

    const meteors = Array.from({ length: meteorCount }, createMeteor);

    /* ---------- DRAW ---------- */
    function drawStars() {
      for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawMeteor(m) {
      const tailX = m.x - m.vx * m.length * 0.05;
      const tailY = m.y - m.vy * m.length * 0.05;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, "rgba(140,230,255,1)");
      grad.addColorStop(0.3, "rgba(100,200,255,0.7)");
      grad.addColorStop(1, "rgba(100,200,255,0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Glow head
      ctx.shadowBlur = 25;
      ctx.shadowColor = "rgba(160,240,255,1)";
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background (transparent so it can overlay content)
      ctx.fillStyle = "rgba(5, 11, 26, 0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStars();

      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;

        drawMeteor(m);

        if (m.life > m.maxLife || m.x < -300 || m.y > canvas.height + 300) {
          meteors[i] = createMeteor();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, [starCount, meteorCount, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        display: "block",
        position,
        top: 0,
        left: 0,
        pointerEvents: "none", // allow clicking through
        zIndex,
      }}
    />
  );
}
