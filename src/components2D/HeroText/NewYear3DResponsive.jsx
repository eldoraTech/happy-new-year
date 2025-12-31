import { useEffect, useRef } from "react";

export default function NewYear3DResponsive({ year = "2026" }) {
  const canvasRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();

      size.current = { w: rect.width, h: rect.height };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const layers = [
      { depth: 0.04, color: "#ffcc00" },
      { depth: 0.025, color: "#ff4ecd" },
      { depth: 0.015, color: "#4dd2ff" }
    ];

    const draw = () => {
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);

      smooth.current.x += (target.current.x - smooth.current.x) * 0.06;
      smooth.current.y += (target.current.y - smooth.current.y) * 0.06;

      const cx = w / 2;
      const cy = h / 2;

      const baseFont = Math.max(30, Math.min(w * 0.12, h * 0.22, 150));
      const titleFont = baseFont * 0.65;
      const yearFont = baseFont * 1.05;
      const lineGap = baseFont * 0.75;

      const t = performance.now() * 0.001;

      layers.forEach((layer, i) => {
        const ox = smooth.current.x * w * layer.depth;
        const oy = smooth.current.y * h * layer.depth;

        const floatTitle = Math.sin(t + i) * 4;
        const floatYear = Math.sin(t * 1.2 + i) * 6;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = w < 768 ? 22 : 45;
        ctx.shadowColor = layer.color;
        ctx.fillStyle = layer.color;

        // Happy New Year (animated)
        ctx.font = `800 ${titleFont}px system-ui, sans-serif`;
        ctx.fillText(
          "Happy New Year",
          cx + ox,
          cy + oy - lineGap + floatTitle
        );

        // Year (stronger animation)
        ctx.font = `900 ${yearFont}px system-ui, sans-serif`;
        ctx.fillText(
          year,
          cx + ox,
          cy + oy + lineGap + floatYear
        );
      });

      requestAnimationFrame(draw);
    };

    draw();

    const updateTarget = (x, y) => {
      target.current.x = (x / size.current.w - 0.5) * 2;
      target.current.y = (y / size.current.h - 0.5) * 2;
    };

    window.addEventListener("mousemove", e =>
      updateTarget(e.clientX, e.clientY)
    );

    window.addEventListener(
      "touchmove",
      e => updateTarget(e.touches[0].clientX, e.touches[0].clientY),
      { passive: true }
    );

    const onTilt = e => {
      if (e.gamma != null && e.beta != null) {
        target.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
        target.current.y = Math.max(-1, Math.min(1, e.beta / 30));
      }
    };

    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
      document.body.addEventListener(
        "click",
        () =>
          DeviceOrientationEvent.requestPermission().then(r => {
            if (r === "granted") {
              window.addEventListener("deviceorientation", onTilt);
            }
          }),
        { once: true }
      );
    } else {
      window.addEventListener("deviceorientation", onTilt);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [year]);

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} />
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    // background: "radial-gradient(circle at center, #085101ff, #05014fff)",
    overflow: "hidden",
    position: "relative",
    zIndex: 5
  },
  hint: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#aaa",
    fontSize: "0.8rem",
    opacity: 0.75,
    userSelect: "none",
    whiteSpace: "nowrap"
  }
};
