// GRAVITY = 0.6      // heavier
// BOUNCE = 0.9       // more bouncy
// MAX_BALLS = 60     // chaos mode
// MOUSE_FORCE = 10   // strong push


import { useEffect, useRef } from "react";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43",
  "#ff8fab"
];

export default function PhysicsPlaygroundCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, down: false });
  const grabbed = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    let balls = [];

    /* =====================
       PHYSICS CONSTANTS
    ===================== */
    const GRAVITY = 0.45;
    const BOUNCE = 0.8;
    const FRICTION = 0.995;
    const MOUSE_FORCE = 6;
    const MOUSE_RADIUS = 140;
    const MAX_BALLS = 40;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* =====================
       INPUT
    ===================== */
    window.addEventListener("mousemove", e => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (mouse.current.down && grabbed.current) {
        grabbed.current.x = mouse.current.x;
        grabbed.current.y = mouse.current.y;
        grabbed.current.vx = 0;
        grabbed.current.vy = 0;
      }
    });

    window.addEventListener("mousedown", () => {
      mouse.current.down = true;

      // grab nearest ball
      balls.forEach(b => {
        const dx = mouse.current.x - b.x;
        const dy = mouse.current.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < b.r) {
          grabbed.current = b;
        }
      });
    });

    window.addEventListener("mouseup", () => {
      mouse.current.down = false;
      grabbed.current = null;
    });

    window.addEventListener("click", e => {
      if (balls.length < MAX_BALLS) {
        balls.push(createBall(e.clientX, e.clientY));
      }
    });

    /* =====================
       BALL CREATION
    ===================== */
    function createBall(x, y) {
      return {
        x,
        y,
        vx: Math.random() * 6 - 3,
        vy: Math.random() * -6,
        r: 16 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }

    balls = Array.from({ length: 18 }, () =>
      createBall(Math.random() * w, Math.random() * h * 0.3)
    );

    /* =====================
       COLLISION
    ===================== */
    function resolveCollision(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const min = a.r + b.r;

      if (dist < min) {
        const angle = Math.atan2(dy, dx);
        const overlap = min - dist;

        const ax = Math.cos(angle) * overlap * 0.5;
        const ay = Math.sin(angle) * overlap * 0.5;

        a.x -= ax;
        a.y -= ay;
        b.x += ax;
        b.y += ay;

        a.vx *= 0.98;
        b.vx *= 0.98;
      }
    }

    /* =====================
       ANIMATION LOOP
    ===================== */
    function animate() {
      ctx.clearRect(0, 0, w, h);

      balls.forEach((b, i) => {
        // Gravity
        b.vy += GRAVITY;

        // Mouse push
        const dx = b.x - mouse.current.x;
        const dy = b.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!mouse.current.down && dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }

        // Move
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= FRICTION;
        b.vy *= FRICTION;

        // Walls
        if (b.x - b.r < 0 || b.x + b.r > w) b.vx *= -BOUNCE;
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy *= -BOUNCE;
        }

        // Collisions
        for (let j = i + 1; j < balls.length; j++) {
          resolveCollision(b, balls[j]);
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
        pointerEvents: "auto"
      }}
    />
  );
}
