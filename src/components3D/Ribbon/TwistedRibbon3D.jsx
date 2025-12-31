import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TwistedRibbon3D({
  color1 = "#ff004c",
  color2 = "#ffd700"
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 8;

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 5, 5);
    scene.add(key);

    /* ---------- RESPONSIVE RIBBON CONFIG ---------- */
    let ribbon;
    let geometry;

    const createRibbon = () => {
      if (ribbon) {
        scene.remove(ribbon);
        geometry.dispose();
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      /* Screen-based scaling */
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;

      const ribbonLength = isMobile ? 4 : isTablet ? 5 : 6.5;
      const ribbonWidth = isMobile ? 0.5 : 0.4;
      const segments = isMobile ? 80 : isTablet ? 120 : 180;

      geometry = new THREE.PlaneGeometry(
        ribbonWidth,
        ribbonLength,
        1,
        segments
      );

      /* ---------- TWIST BASED ON SCREEN ---------- */
      const pos = geometry.attributes.position;
      const twistStrength = isMobile ? Math.PI * 1.5 : Math.PI * 2.5;

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const t = (y + ribbonLength / 2) / ribbonLength;

        const twist = t * twistStrength * 2;
        const x = pos.getX(i);

        pos.setX(i, Math.cos(twist) * x);
        pos.setZ(i, Math.sin(twist) * x);
      }

      pos.needsUpdate = true;
      geometry.computeVertexNormals();

      /* ---------- COLOR GRADIENT ---------- */
      const colors = [];
      const c1 = new THREE.Color(color1);
      const c2 = new THREE.Color(color2);

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const t = (y + ribbonLength / 2) / ribbonLength;
        const c = c1.clone().lerp(c2, t);
        colors.push(c.r, c.g, c.b);
      }

      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.35,
        metalness: 0.1
      });

      ribbon = new THREE.Mesh(geometry, material);
      scene.add(ribbon);
    };

    /* ---------- RESIZE ---------- */
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      camera.position.z = w < 768 ? 7 : 8;

      createRibbon();
    };

    resize();
    window.addEventListener("resize", resize);

    /* ---------- ANIMATION ---------- */
    const animate = () => {
      requestAnimationFrame(animate);

      if (ribbon) {
        ribbon.rotation.y += 0.01;
        ribbon.rotation.x = Math.sin(Date.now() * 0.001) * 0.25;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ---------- CLEANUP ---------- */
    return () => {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [color1, color2]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "500px",
        height: "500px",
        background: "transparent",
        overflow: "hidden"
      }}
    />
  );
}
