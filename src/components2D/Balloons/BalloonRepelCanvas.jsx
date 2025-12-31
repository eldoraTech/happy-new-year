import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43",
  "#ff8fab",
  "#90dbf4"
];

export default function BalloonRepelCanvas({NoOfBalloons = 10}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let balloons = [];
    const BALLOON_COUNT = NoOfBalloons;

    const mouse = {
      x: null,
      y: null,
      radius: 140 // repel distance
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    function createBalloons() {
      balloons = Array.from({ length: BALLOON_COUNT }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.6,
        radius: 18 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.3 + Math.random() * 1.6,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.02,
        riseOnLoad: Math.random() > 0.5,
        vx: 0,
        vy: 0
      }));
    }

    createBalloons();

    function drawBalloon(b) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1;

      const tailLength = 45;
      ctx.moveTo(b.x, b.y + b.radius);
      for (let i = 0; i < tailLength; i += 5) {
        ctx.lineTo(
          b.x + Math.sin((b.y + i) * 0.12) * 3,
          b.y + b.radius + i
        );
      }
      ctx.stroke();

      const gradient = ctx.createRadialGradient(
        b.x - b.radius / 3,
        b.y - b.radius / 3,
        4,
        b.x,
        b.y,
        b.radius
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, b.color);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.ellipse(b.x, b.y, b.radius, b.radius * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function applyRepel(b) {
      if (mouse.x === null) return;

      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        b.vx += Math.cos(angle) * force * 1.8;
        b.vy += Math.sin(angle) * force * 1.8;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        // upward float
        b.y -= b.speed;

        if (b.riseOnLoad && b.y > height * 0.6) {
          b.y -= 0.9;
        }

        // sway
        b.sway += b.swaySpeed;
        b.x += Math.sin(b.sway) * 0.35;

        // repel
        applyRepel(b);

        // velocity damping
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.92;
        b.vy *= 0.92;

        // loop
        if (b.y < -120) {
          b.y = height + 120;
          b.x = Math.random() * width;
          b.vx = 0;
          b.vy = 0;
        }

        drawBalloon(b);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", () => {});
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
