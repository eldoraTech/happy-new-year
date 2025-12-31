import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

/* ================= CONFIG ================= */
const CONFIG = {
  textDesktop: "HAPPY NEW YEAR 2026",
  textMobile: "HAPPY\nNEW\nYEAR\n2026",

  fontSize: 2.5,
  fontDepth: 0.6,
  bevelThickness: 0.12,

  padding: 1.2, // 🔑 SAFE SPACE AROUND TEXT

  colorTop: "#ffd700",
  colorBottom: "#ff7a18",

  cameraFov: 45,
};
/* ========================================== */

export default function HappyNewYearRibbonText() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(
      CONFIG.cameraFov,
      1,
      0.1,
      100
    );

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 6, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(-5, -2, 4);
    scene.add(fill);

    let textMesh;
    let fontRef;

    const loader = new FontLoader();

    /* ---------- BUILD TEXT ---------- */
    const buildText = (isMobile, width, height) => {
      if (!fontRef) return;

      if (textMesh) {
        scene.remove(textMesh);
        textMesh.geometry.dispose();
        textMesh.material.dispose();
      }

      const geometry = new TextGeometry(
        isMobile ? CONFIG.textMobile : CONFIG.textDesktop,
        {
          font: fontRef,
          size: CONFIG.fontSize,
          height: CONFIG.fontDepth,
          curveSegments: 24,
          bevelEnabled: true,
          bevelThickness: CONFIG.bevelThickness,
          bevelSize: 0.08,
          bevelSegments: 8,
        }
      );

      /* ---------- RIBBON + COLOR ---------- */
      const pos = geometry.attributes.position;
      const colors = [];

      const topColor = new THREE.Color(CONFIG.colorTop);
      const bottomColor = new THREE.Color(CONFIG.colorBottom);

      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);

        pos.setX(i, pos.getX(i) + Math.sin(y * 1.4) * 0.45);
        pos.setZ(i, Math.cos(y * 1.4) * 0.18);

        const t = (y + 1) / 2;
        const c = bottomColor.clone().lerp(topColor, t);
        colors.push(c.r, c.g, c.b);
      }

      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      geometry.center();

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.28,
        metalness: 0.35,
      });

      textMesh = new THREE.Mesh(geometry, material);
      scene.add(textMesh);

      /* ---------- PERFECT FIT (NO CLIP) ---------- */
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);

      const aspect = width / height;
      const maxVisibleWidth = aspect * 2; // camera frustum width at z=1

      const scale =
        (maxVisibleWidth / size.x) * CONFIG.padding;

      textMesh.scale.setScalar(scale);

      /* ---------- CAMERA ---------- */
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
    };

    /* ---------- RESIZE ---------- */
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      buildText(width < 768, width, height);
    };

    loader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
      fontRef = font;
      resize();
    });

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      observer.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
