// left side balloons, right side balloons, they stay in middle area 
// it need styles from Balloons.css to work properly
import "./Balloons.css";
import { useEffect } from "react";
import gsap from "gsap";

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcbef",
  "#6bff95",
  "#d77bff",
  "#ff9f43"
];

function BalloonBunch({ side }) {
  return (
    <div className={`balloon-bunch ${side}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="balloon"
          style={{
            background: `radial-gradient(circle at 30% 30%, #ffffff, ${
              COLORS[Math.floor(Math.random() * COLORS.length)]
            })`,
            left: `${i * 22}px`,          // GAP between balloons
            top: `${(i % 2 === 0 ? -1 : 1) * (10 + i * 8)}px`,
            zIndex: 10 - i
          }}
        />
      ))}
    </div>
  );
}

export default function Balloons() {
  useEffect(() => {
    const bunches = gsap.utils.toArray(".balloon-bunch");
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    bunches.forEach((bunch, bunchIndex) => {
      const balloons = bunch.querySelectorAll(".balloon");

      // POP UP BUNCH
      gsap.set(bunch, { y: 200, opacity: 0 });
      gsap.to(bunch, {
        y: 0,
        opacity: 1,
        duration: 2.2,
        delay: bunchIndex * 0.6,
        ease: "power3.out"
      });

      // FLOAT WHOLE BUNCH
      gsap.to(bunch, {
        y: "-=70",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
      });

      // SWAY WHOLE BUNCH
      gsap.to(bunch, {
        x: bunchIndex === 0 ? 26 : -26,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // INDIVIDUAL BALLOON MOTION (IMPORTANT)
      balloons.forEach((balloon, i) => {
        gsap.to(balloon, {
          y: `+=${i % 2 === 0 ? 12 : -12}`,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        gsap.to(balloon, {
          x: `+=${i % 2 === 0 ? 6 : -6}`,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    });

    // OPTIONAL MOUSE PARALLAX (DESKTOP ONLY)
    if (!isTouch) {
      const onMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        bunches.forEach((b, i) => {
          gsap.to(b, {
            x: i === 0 ? x : -x,
            duration: 1,
            ease: "power3.out"
          });
        });
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }
  }, []);

  return (
    <>
      <BalloonBunch side="left" />
      <BalloonBunch side="right" />
      <BalloonBunch side="left" />
      <BalloonBunch side="right" />
    </>
  );
}
