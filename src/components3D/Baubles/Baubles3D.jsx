import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Baubles3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffddaa, 1.5);
    rimLight.position.set(-5, 3, 4);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    /* ---------- ENVIRONMENT (REFLECTIONS) ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.jpg",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const envMap = pmrem.fromEquirectangular(texture).texture;
        envMap.rotation = Math.PI / 2;
        scene.environment = envMap;
        texture.dispose();
        pmrem.dispose();
      }
    );

    /* ---------- BAUBLE GROUP ---------- */
    const baubleGroup = new THREE.Group();
    scene.add(baubleGroup);

    /* ---------- BAUBLE MATERIAL ---------- */
    const baubleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700, // gold
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color(0x221100),
      emissiveIntensity: 0.2
    });

    /* ---------- SPHERE ---------- */
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      baubleMaterial
    );
    baubleGroup.add(sphere);

    /* ---------- CAP ---------- */
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.3, 32),
      new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 1,
        roughness: 0.2
      })
    );
    cap.position.y = 1.1;
    baubleGroup.add(cap);

    /* ---------- STRING ---------- */
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    string.position.y = 2.6;
    baubleGroup.add(string);

    /* ---------- POSITION ---------- */
    baubleGroup.position.y = 0.5;

    /* ---------- MOUSE INTERACTION ---------- */
    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    /* ---------- ANIMATION ---------- */
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Gentle swing (hanging effect)
      baubleGroup.rotation.z = Math.sin(time) * 0.2;

      // Mouse influence
      baubleGroup.rotation.x +=
        (mouse.y * 0.3 - baubleGroup.rotation.x) * 0.05;
      baubleGroup.rotation.y +=
        (mouse.x * 0.3 - baubleGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    /* ---------- RESIZE ---------- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ---------- CLEANUP ---------- */
    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle at top, #4e01f3ff, #000)"
      }}
    />
  );
}
