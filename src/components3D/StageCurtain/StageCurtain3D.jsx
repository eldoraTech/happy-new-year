import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StageCurtain3D({ open = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    const WIDTH = 420;
    const HEIGHT = 260;

    container.style.width = `${WIDTH}px`;
    container.style.height = `${HEIGHT}px`;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 100);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const spot = new THREE.DirectionalLight(0xffffff, 1.2);
    spot.position.set(5, 5, 5);
    scene.add(spot);

    /* ---------- CURTAIN MATERIAL ---------- */
    const curtainMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000, // deep red
      roughness: 0.7,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    /* ---------- CURTAIN GEOMETRY (WITH FOLDS) ---------- */
    const curtainGeo = new THREE.PlaneGeometry(4, 5, 20, 20);

    // Add vertical folds
    const pos = curtainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 4) * 0.12);
    }
    pos.needsUpdate = true;
    curtainGeo.computeVertexNormals();

    /* ---------- LEFT CURTAIN ---------- */
    const leftCurtain = new THREE.Mesh(curtainGeo, curtainMaterial);
    leftCurtain.position.x = -2;
    scene.add(leftCurtain);

    /* ---------- RIGHT CURTAIN ---------- */
    const rightCurtain = new THREE.Mesh(curtainGeo, curtainMaterial);
    rightCurtain.position.x = 2;
    scene.add(rightCurtain);

    /* ---------- ANIMATION ---------- */
    let progress = open ? 0 : 1;

    const animate = () => {
      requestAnimationFrame(animate);

      // Opening animation
      progress += (open ? 0.015 : -0.015);
      progress = THREE.MathUtils.clamp(progress, 0, 1);

      leftCurtain.position.x = -2 - progress * 2.2;
      rightCurtain.position.x = 2 + progress * 2.2;

      // Slight sway for realism
      leftCurtain.rotation.y = -progress * 0.15;
      rightCurtain.rotation.y = progress * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [open]);

  return (
    <div
      ref={mountRef}
      style={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    />
  );
}
