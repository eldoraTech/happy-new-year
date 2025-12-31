// it is time limited version of FullScreenBalloonsCanvas_WithTimeLimt.jsx
// we handle the time limit here use this variable 
// const HOLD_TIME = 10000; // 10 seconds

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

export default function FullScreenBalloonsCanvas_WithTimeLimt({ onFinish }) {
  const canvasRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const exitingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let balloons = [];
    const BALLOON_COUNT = 18;
    const HOLD_TIME = 10000; // 10 seconds

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function createBalloons() {
      balloons = Array.from({ length: BALLOON_COUNT }, () => ({
        x: Math.random() * width,
        y: height + Math.random() * height * 0.6,
        radius: 18 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.4 + Math.random() * 0.5,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02
      }));
    }

    createBalloons();

    function drawBalloon(b) {
      // Twisted string
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1;
      ctx.moveTo(b.x, b.y + b.radius);
      for (let i = 0; i < 45; i += 5) {
        ctx.lineTo(
          b.x + Math.sin((b.y + i) * 0.12) * 3,
          b.y + b.radius + i
        );
      }
      ctx.stroke();

      // Balloon body
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

    function animate() {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      ctx.clearRect(0, 0, width, height);

      // After 10 seconds → start exit
      if (elapsed > HOLD_TIME) {
        exitingRef.current = true;
      }

      balloons.forEach((b) => {
        // Exit phase = faster rise
        b.y -= exitingRef.current ? b.speed * 2.2 : b.speed;

        // Gentle sway
        b.sway += b.swaySpeed;
        b.x += Math.sin(b.sway) * 0.3;

        drawBalloon(b);
      });

      // When all balloons leave screen → finish
      if (
        exitingRef.current &&
        balloons.every((b) => b.y < -150)
      ) {
        onFinish?.();
        return;
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
}
