// Stronger repel:          const FORCE_STRENGTH = 6;
// Larger influence area:   const FORCE_RADIUS = 130;
// Slower recovery:         const FRICTION = 0.95;

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

export default function ConfettiRepelCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let pieces = [];
    const COUNT = 140;
    const FORCE_RADIUS = 130;  // Larger influence area
    const FORCE_STRENGTH = 2;  // Stronger repel
    const FRICTION = 0.95;     // Slower recovery

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function onMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) window.addEventListener("mousemove", onMove);

    // Initialize confetti pieces
    pieces = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,  // start above screen for top-to-bottom fall
      vx: (Math.random() - 0.5) * 0.5, // small horizontal drift
      vy: Math.random() * 2 + 1,      // vertical fall speed
      size: Math.random() * 6 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.1 - 0.05
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      pieces.forEach(p => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Apply vertical repel force from mouse
        if (dist < FORCE_RADIUS) {
          const force = (1 - dist / FORCE_RADIUS) * FORCE_STRENGTH;
          p.vy += (dy / dist) * force;
          p.vx += (dx / dist) * force * 0.2; // optional slight horizontal push
        }

        // Apply friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Gravity / natural fall
        p.vy += 0.05; // constant downward acceleration

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Reset if fallen off bottom
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.vy = Math.random() * 2 + 1; // restart fall speed
        }

        // Draw confetti piece
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (!isTouch) window.removeEventListener("mousemove", onMove);
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
