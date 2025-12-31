// no time limit version of FullScreenBalloonsCanvas_WithTimeLimt.jsx
// infinite balloons animation

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

export default function FullScreenBalloonsCanvas_WithOutTimeLimt() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let balloons = [];
    const BALLOON_COUNT = 24; // full screen but not crowded

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createBalloons() {
      balloons = Array.from({ length: BALLOON_COUNT }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.6, // start below
        radius: 18 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.3 + Math.random() * 1.6,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.02,
        riseOnLoad: Math.random() > 0.5
      }));
    }

    createBalloons();

    function drawBalloon(b) {
      // TWISTED STRING
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

      // BALLOON BODY
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
      ctx.ellipse(
        b.x,
        b.y,
        b.radius,
        b.radius * 1.15,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        // UPWARD FLOAT
        b.y -= b.speed;

        // EXTRA SMOOTH RISE ON RELOAD (only some)
        if (b.riseOnLoad && b.y > height * 0.6) {
          b.y -= 0.9;
        }

        // INDIVIDUAL SWAY
        b.sway += b.swaySpeed;
        b.x += Math.sin(b.sway) * 0.35;

        // LOOP WHEN OUT OF VIEW
        if (b.y < -120) {
          b.y = height + 120;
          b.x = Math.random() * width;
        }

        drawBalloon(b);
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
        zIndex: 2,          // keep below text if needed
        pointerEvents: "none"
      }}
    />
  );
}
