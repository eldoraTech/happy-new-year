import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AdjustableTwistedRibbon3D({
  /* ---------- SIZE ---------- */
  fullScreen = false,
  width = window.innerWidth * 0.10,
  height = window.innerHeight,

  /* ---------- RIBBON SHAPE ---------- */
  ribbonLength = 6,        // height of ribbon in 3D units
  ribbonWidth = 0.45,      // thickness
  twists = 3,              // number of full twists
  segments = 180,          // smoothness (higher = smoother)

  /* ---------- COLORS ---------- */
  colorTop = "#ff004c",
  colorBottom = "#ffd700",

  /* ---------- ANIMATION ---------- */
  rotateSpeed = 0.01,
  waveStrength = 0.25,
  waveSpeed = 0.0015,

  /* ---------- CAMERA ---------- */
  cameraDistance = 8,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = cameraDistance;

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 5, 5);
    scene.add(key);

    /* ---------- CREATE RIBBON ---------- */
    const geometry = new THREE.PlaneGeometry(
      ribbonWidth,
      ribbonLength,
      1,
      segments
    );

    /* ---------- TWIST LOGIC ---------- */
    const pos = geometry.attributes.position;
    const totalTwist = twists * Math.PI * 2;

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + ribbonLength / 2) / ribbonLength;
      const angle = t * totalTwist;
      const x = pos.getX(i);

      pos.setX(i, Math.cos(angle) * x);
      pos.setZ(i, Math.sin(angle) * x);
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    /* ---------- GRADIENT COLOR ---------- */
    const colors = [];
    const c1 = new THREE.Color(colorTop);
    const c2 = new THREE.Color(colorBottom);

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

    /* ---------- MATERIAL ---------- */
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.1,
    });

    const ribbon = new THREE.Mesh(geometry, material);
    scene.add(ribbon);

    /* ---------- RESIZE ---------- */
    const resize = () => {
      const w = fullScreen ? window.innerWidth : width;
      const h = fullScreen ? window.innerHeight : height;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    /* ---------- ANIMATION LOOP ---------- */
    const animate = () => {
      requestAnimationFrame(animate);

      ribbon.rotation.y += rotateSpeed;
      ribbon.rotation.x =
        Math.sin(Date.now() * waveSpeed) * waveStrength;

      renderer.render(scene, camera);
    };
    animate();

    /* ---------- CLEANUP ---------- */
    return () => {
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [
    fullScreen,
    width,
    height,
    ribbonLength,
    ribbonWidth,
    twists,
    segments,
    colorTop,
    colorBottom,
    rotateSpeed,
    waveStrength,
    waveSpeed,
    cameraDistance,
  ]);

  return (
    <div
      ref={mountRef}
      style={{
        width: fullScreen ? "100vw" : `${width}px`,
        height: fullScreen ? "100vh" : `${height}px`,
        overflow: "hidden",
        // background: "green",
        padding: 0,
        margin: 0,
      }}
    />
  );
}
