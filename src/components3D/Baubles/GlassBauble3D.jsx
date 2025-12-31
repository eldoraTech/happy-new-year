import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlassBauble3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    /* ---------------- SCENE ---------------- */
    const scene = new THREE.Scene();

    /* ---------------- CAMERA ---------------- */
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    /* ---------------- RENDERER ---------------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    /* ---------------- LIGHTS ---------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.5);
    rimLight.position.set(-5, 3, 4);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    /* ---------------- ENVIRONMENT MAP (REQUIRED FOR GLASS) ---------------- */
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

    /* ---------------- BAUBLE GROUP ---------------- */
    const baubleGroup = new THREE.Group();
    scene.add(baubleGroup);

    /* ---------------- REAL GLASS MATERIAL ---------------- */
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,        // real glass transparency
      thickness: 1.2,         // glass volume
      ior: 1.5,               // refraction index (glass)
      reflectivity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0
    });

    /* ---------------- GLASS SPHERE ---------------- */
    const glassSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      glassMaterial
    );
    baubleGroup.add(glassSphere);

    /* ---------------- METAL CAP ---------------- */
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.3, 32),
      new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1,
        roughness: 0.25
      })
    );
    cap.position.y = 1.1;
    baubleGroup.add(cap);

    /* ---------------- STRING ---------------- */
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    string.position.y = 2.6;
    baubleGroup.add(string);

    baubleGroup.position.y = 0.5;

    /* ---------------- MOUSE INTERACTION ---------------- */
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ---------------- ANIMATION ---------------- */
    let t = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      t += 0.01;

      // Hanging swing
      baubleGroup.rotation.z = Math.sin(t) * 0.25;

      // Mouse parallax
      baubleGroup.rotation.x +=
        (mouse.y * 0.25 - baubleGroup.rotation.x) * 0.05;
      baubleGroup.rotation.y +=
        (mouse.x * 0.25 - baubleGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    /* ---------------- RESIZE ---------------- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ---------------- CLEANUP ---------------- */
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
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
        background: "radial-gradient(circle at top, #5609fbff, #000)"
      }}
    />
  );
}
