// import { useEffect, useRef } from "react";

// export default function FireworksCanvas() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     let width, height;
//     let particles = [];

//     const AUTO_FIRE_INTERVAL = 2200; // ms
//     const BASE_PARTICLES = 80;

//     function resize() {
//       width = canvas.width = window.innerWidth;
//       height = canvas.height = window.innerHeight;
//     }

//     resize();
//     window.addEventListener("resize", resize);

//     // Firecracker burst
//     function firecracker(x, y, power = BASE_PARTICLES) {
//       for (let i = 0; i < power; i++) {
//         const angle = Math.random() * Math.PI * 2;
//         const speed = Math.random() * 4 + 2;

//         particles.push({
//           x,
//           y,
//           vx: Math.cos(angle) * speed,
//           vy: Math.sin(angle) * speed,
//           life: 80,
//           alpha: 1
//         });
//       }
//     }

//     // Auto background firecrackers
//     const autoFire = setInterval(() => {
//       firecracker(
//         Math.random() * width,
//         Math.random() * height * 0.35 + 40,
//         BASE_PARTICLES
//       );
//     }, AUTO_FIRE_INTERVAL);

//     // Click / tap firecrackers
//     function handleClick(e) {
//       firecracker(e.clientX, e.clientY, 140);
//     }

//     window.addEventListener("click", handleClick);

//     function animate() {
//       ctx.clearRect(0, 0, width, height);

//       particles = particles.filter(p => p.life > 0);

//       particles.forEach(p => {
//         p.x += p.vx;
//         p.y += p.vy;
//         p.vy += 0.02;
//         p.life--;
//         p.alpha -= 0.012;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 215, 150, ${p.alpha})`;
//         ctx.shadowBlur = 10;
//         ctx.shadowColor = "rgba(255, 215, 150, 0.8)";
//         ctx.fill();
//       });

//       requestAnimationFrame(animate);
//     }

//     animate();

//     return () => {
//       clearInterval(autoFire);
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("click", handleClick);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       id="fireworks"
//       style={{
//         position: "fixed",
//         inset: 0,
//         pointerEvents: "none",
//         zIndex: 1
//       }}
//     />
//   );
// }

import { useEffect, useRef } from "react";

const COLORS = [
  "255, 215, 150", // gold
  "255, 99, 132",  // red
  "54, 162, 235",  // blue
  "75, 192, 192",  // teal
  "153, 102, 255", // purple
  "255, 159, 64"   // orange
];

export default function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    let particles = [];

    const AUTO_FIRE_INTERVAL = 2200;
    const BASE_PARTICLES = 80;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Firecracker burst (COLORFUL)
    function firecracker(x, y, power = BASE_PARTICLES) {
      const color =
        COLORS[Math.floor(Math.random() * COLORS.length)];

      for (let i = 0; i < power; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 80,
          alpha: 1,
          color // each firework has its own color
        });
      }
    }

    // Auto background firecrackers
    const autoFire = setInterval(() => {
      firecracker(
        Math.random() * width,
        Math.random() * height * 0.35 + 40,
        BASE_PARTICLES
      );
    }, AUTO_FIRE_INTERVAL);

    // Click / tap firecrackers (bigger + colorful)
    function handleClick(e) {
      firecracker(e.clientX, e.clientY, 140);
    }

    window.addEventListener("click", handleClick);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.life--;
        p.alpha -= 0.012;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      clearInterval(autoFire);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fireworks"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  );
}
