// left side balloons, right side balloons, very few center balloons
// infinite float with sway, string tail, gradient fill

import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43"
];

export default function BalloonsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let balloons = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // CREATE BALLOONS (LEFT, RIGHT, VERY FEW CENTER)
    function createBalloons() {
      balloons = [];

      // LEFT SIDE (more)
      for (let i = 0; i < 4; i++) {
        balloons.push(createBalloon("left"));
      }

      // RIGHT SIDE (more)
      for (let i = 0; i < 4; i++) {
        balloons.push(createBalloon("right"));
      }

      // CENTER (very few)
      for (let i = 0; i < 2; i++) {
        balloons.push(createBalloon("center"));
      }
    }

    function createBalloon(position) {
      let x;

      if (position === "left") {
        x = 40 + Math.random() * 120;
      } else if (position === "right") {
        x = width - (40 + Math.random() * 120);
      } else {
        // center (safe zone – sparse)
        x = width / 2 + (Math.random() * 80 - 40);
      }

      return {
        x,
        y: height + Math.random() * 200,
        radius: 22 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: 0.35 + Math.random() * 0.5,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        riseOnLoad: Math.random() > 0.5,
        zone: position
      };
    }

    createBalloons();

    function drawBalloon(b) {
      // STRING / TWISTED TAIL
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1;

      const tailLength = 45;
      ctx.moveTo(b.x, b.y + b.radius);
      for (let i = 0; i < tailLength; i += 5) {
        ctx.lineTo(
          b.x + Math.sin((b.y + i) * 0.1) * 3,
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
      ctx.ellipse(b.x, b.y, b.radius, b.radius * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        // UPWARD FLOAT
        b.y -= b.speed;

        // EXTRA SMOOTH RISE ON RELOAD (only some)
        if (b.riseOnLoad && b.y > height * 0.65) {
          b.y -= 1;
        }

        // INDIVIDUAL SWAY
        b.sway += b.swaySpeed;
        b.x += Math.sin(b.sway) * 0.3;

        // RESET WHEN OUT OF VIEW
        if (b.y < -120) {
          b.y = height + 120;
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
        zIndex: 3,
        pointerEvents: "none"
      }}
    />
  );
}
