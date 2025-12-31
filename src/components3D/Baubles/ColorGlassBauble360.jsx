import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ColorGlassBauble360() {
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
    renderer.toneMappingExposure = 1.25;

    mountRef.current.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff88ff, 1.5);
    rimLight.position.set(-5, 3, 4);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    /* ---------- ENVIRONMENT ---------- */
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

    /* ---------- OUTER GLASS (COLORED) ---------- */
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff4ecd"), // 🌈 pinkish glass
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 1.4,
      ior: 1.5,
      reflectivity: 0.6,
      clearcoat: 1,
      clearcoatRoughness: 0
    });

    const outerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      glassMaterial
    );
    baubleGroup.add(outerSphere);

    /* ---------- INNER COLOR CORE (DEPTH MAGIC) ---------- */
    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 48, 48),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#00ffd5"), // cyan core
        emissive: new THREE.Color("#00ffd5"),
        emissiveIntensity: 0.6,
        roughness: 0.4,
        metalness: 0.2
      })
    );
    baubleGroup.add(innerCore);

    /* ---------- CAP ---------- */
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.3, 32),
      new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        metalness: 1,
        roughness: 0.25
      })
    );
    cap.position.y = 1.1;
    baubleGroup.add(cap);

    /* ---------- STRING ---------- */
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xdddddd })
    );
    string.position.y = 2.6;
    baubleGroup.add(string);

    baubleGroup.position.y = 0.5;

    /* ---------- ROTATION (FEELABLE 3D) ---------- */
    const animate = () => {
      requestAnimationFrame(animate);

      // steady horizontal rotation
      baubleGroup.rotation.y += 0.015;

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
        background: "radial-gradient(circle at top, #080018, #000)"
      }}
    />
  );
}
