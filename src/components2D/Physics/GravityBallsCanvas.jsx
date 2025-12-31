// const COUNT = 30;      // more balls
// const GRAVITY = 0.6;  // heavier balls
// const BOUNCE = 0.9;   // more bouncy
// const MOUSE_FORCE = 8 // stronger push


import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43"
];

export default function GravityBallsCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let balls = [];

    const COUNT = 20;
    const GRAVITY = 0.4;
    const BOUNCE = 0.75;
    const FRICTION = 0.995;
    const MOUSE_FORCE = 5;
    const MOUSE_RADIUS = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", e => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    // ⚪ Create balls
    balls = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.3,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 2,
      r: 16 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    function collide(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.r + b.r;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const targetX = a.x + Math.cos(angle) * minDist;
        const targetY = a.y + Math.sin(angle) * minDist;

        const ax = (targetX - b.x) * 0.5;
        const ay = (targetY - b.y) * 0.5;

        a.vx -= ax;
        a.vy -= ay;
        b.vx += ax;
        b.vy += ay;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      balls.forEach((b, i) => {
        // Gravity
        b.vy += GRAVITY;

        // Mouse push
        const dx = b.x - mouse.current.x;
        const dy = b.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }

        // Movement
        b.x += b.vx;
        b.y += b.vy;

        b.vx *= FRICTION;
        b.vy *= FRICTION;

        // Floor bounce
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy *= -BOUNCE;
        }

        // Wall bounce
        if (b.x - b.r < 0 || b.x + b.r > w) {
          b.vx *= -0.8;
        }

        // Ball-to-ball collisions
        for (let j = i + 1; j < balls.length; j++) {
          collide(b, balls[j]);
        }

        // Draw
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
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
