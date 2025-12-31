import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GiftBox3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(2.5, 2, 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    /* =========================
       LIGHTING (Soft Studio)
    ========================= */
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(3, 5, 4);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-4, 2, 3);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-2, 5, -4);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);

    scene.add(keyLight, fillLight, rimLight, ambient);

    /* =========================
       MATERIAL (Matte Neutral)
    ========================= */
    const material = new THREE.MeshStandardMaterial({
      color: 0xb5b5b5,
      roughness: 0.65,
      metalness: 0
    });

    /* =========================
       BOX BODY
    ========================= */
    const boxSize = 1;
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const box = new THREE.Mesh(boxGeometry, material);

    /* =========================
       LID (Separate Mesh)
    ========================= */
    const lidHeight = 0.22;
    const lidGeometry = new THREE.BoxGeometry(1.02, lidHeight, 1.02);
    const lid = new THREE.Mesh(lidGeometry, material);

    lid.position.y = boxSize / 2 + lidHeight / 2;

    /* =========================
       GROUP
    ========================= */
    const giftBox = new THREE.Group();
    giftBox.add(box);
    giftBox.add(lid);

    scene.add(giftBox);

    /* =========================
       ANIMATION LOOP
    ========================= */
    const animate = () => {
      requestAnimationFrame(animate);

      // Idle animation (optional)
      lid.position.y =
        boxSize / 2 + lidHeight / 2 + Math.sin(Date.now() * 0.002) * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    /* =========================
       CLEANUP
    ========================= */
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
