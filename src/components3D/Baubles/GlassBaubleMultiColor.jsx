import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PartyBaubleHex() {
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.physicallyCorrectLights = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    /* ---------- BACKGROUND ---------- */
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0xfffff })
    );
    bg.position.z = -10;
    scene.add(bg);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(5, 5, 5);
    scene.add(key);

    const rim = new THREE.PointLight(0xffffff, 2);
    rim.position.set(-5, -3, 5);
    scene.add(rim);

    /* ---------- ENVIRONMENT ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.jpg",
      (t) => {
        t.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = pmrem.fromEquirectangular(t).texture;
        t.dispose();
        pmrem.dispose();
      }
    );

    /* ---------- FACETED GEOMETRY (KEY PART) ---------- */
    // Icosahedron gives hex/polygon-like facets
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    geometry.computeVertexNormals();

    /* ---------- MULTI-COLOR FACE MATERIAL ---------- */
    const colors = [
      new THREE.Color("#ff004c"), // pink
    //   new THREE.Color("#00eaff"), // cyan
      new THREE.Color("#ffe600"), // yellow
    //   new THREE.Color("#8aff00"), // green
    //   new THREE.Color("#ff7a00"), // orange
    //   new THREE.Color("#7a00ff")  // purple
    ];

    const faceColors = [];
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      faceColors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(faceColors, 3)
    );

    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.15,
      metalness: 0.6,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });

    const bauble = new THREE.Mesh(geometry, material);
    scene.add(bauble);

    /* ---------- CAP ---------- */
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.3, 32),
      new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 1,
        roughness: 0.25
      })
    );
    cap.position.y = 1.6;
    scene.add(cap);

    /* ---------- STRING ---------- */
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 3),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    string.position.y = 3;
    scene.add(string);

    /* ---------- ROTATION ---------- */
    const animate = () => {
      requestAnimationFrame(animate);

      // Party-style rotation
      bauble.rotation.y += 0.01;
      bauble.rotation.x += 0.004;

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

    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
