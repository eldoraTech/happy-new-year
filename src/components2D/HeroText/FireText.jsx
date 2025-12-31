import { b } from "framer-motion/client";
import { useEffect, useRef } from "react";

export default function FireText({ year = "2026" }) {
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Firework {
      constructor(x, y) {
        this.particles = [];
        const colors = ["#ffcc00", "#ff4ecd", "#4dd2ff", "#00ff99"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 60; i++) {
          this.particles.push({
            x,
            y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 5 + 2,
            life: 100,
            color
          });
        }
      }

      update() {
        this.particles.forEach(p => {
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;
          p.life--;
        });
      }

      draw() {
        this.particles.forEach(p => {
          ctx.globalAlpha = p.life / 100;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      isDead() {
        return this.particles.every(p => p.life <= 0);
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.isDead()) fireworksRef.current.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const interval = setInterval(() => {
      fireworksRef.current.push(
        new Firework(
          Math.random() * canvas.width,
          Math.random() * canvas.height * 0.6
        )
      );
    }, 900);

    const clickHandler = (e) => {
      fireworksRef.current.push(new Firework(e.clientX, e.clientY));
    };

    canvas.addEventListener("click", clickHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    // background:"radial-gradient(circle at bottom, #020024, #000)",
    background:"transparent",
    overflow: "hidden"
  },
  canvas: {
    position: "absolute",
    inset: 0
  },
  textBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
    color: "#fff",
    animation: "fadeIn 2s ease"
  },
  title: {
    fontSize: "clamp(2.2rem, 6vw, 5rem)",
    background:
      "linear-gradient(90deg, #ffcc00, #ff4ecd, #4dd2ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 30px rgba(255,255,255,0.4)"
  },
  subtitle: {
    marginTop: 10,
    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
    opacity: 0.9
  }
};
