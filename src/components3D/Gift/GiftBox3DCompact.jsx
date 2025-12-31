import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GiftBox3DCompact({ size = "large", padding = 0.9 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SIZE ---------- */
    const SIZE_MAP = {
      verysmall: 120,
      small: 220,
      medium: 320,
      large: 420,
    };

    const CANVAS_SIZE = SIZE_MAP[size] || 320;
    container.style.width = `${CANVAS_SIZE}px`;
    container.style.height = `${CANVAS_SIZE}px`;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.2, 100);
    camera.position.set(0, 1.2 * padding+0.5, 6 * padding);
    camera.lookAt(0, -.5, 0);

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(6, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.2);
    fillLight.position.set(-6, 3, 4);
    scene.add(fillLight);

    /* ---------- MATERIALS ---------- */
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xd10000,
      roughness: 0.35,
      metalness: 0.1,
    });

    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd400,
      roughness: 0.25,
      metalness: 0.3,
    });

    /* ---------- GIFT GROUP ---------- */
    const gift = new THREE.Group();
    scene.add(gift);

    /* ---------- BOX ---------- */
    gift.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 2.5), boxMaterial));

    /* ---------- RIBBONS ---------- */
    gift.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.05, 2.55), ribbonMaterial));
    gift.add(new THREE.Mesh(new THREE.BoxGeometry(2.55, 2.05, 0.3), ribbonMaterial));

    /* ---------- LID ---------- */
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.4, 2.6),
      boxMaterial
    );
    lid.position.y = 1.2;
    gift.add(lid);

    /* ---------- LID RIBBONS ---------- */
    const lidRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.45, 2.65),
      ribbonMaterial
    );
    lidRibbonV.position.y = 1.2;
    gift.add(lidRibbonV);

    const lidRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 0.45, 0.3),
      ribbonMaterial
    );
    lidRibbonH.position.y = 1.2;
    gift.add(lidRibbonH);

    /* ---------- PERFECT SMOOTH BOW ---------- */
    function createBowLoop(direction) {
      const h = 1.55;
      const s = 0.55;

      let pts;
      switch (direction) {
        case "front":
          pts = [
            [0, h, 0],
            [0, h + 0.2, s],
            [0, h, s * 1.4],
            [0, h - 0.15, s],
            [0, h, 0],
          ];
          break;
        case "back":
          pts = [
            [0, h, 0],
            [0, h + 0.2, -s],
            [0, h, -s * 1.4],
            [0, h - 0.15, -s],
            [0, h, 0],
          ];
          break;
        case "right":
          pts = [
            [0, h, 0],
            [s, h + 0.2, 0],
            [s * 1.4, h, 0],
            [s, h - 0.15, 0],
            [0, h, 0],
          ];
          break;
        case "left":
          pts = [
            [0, h, 0],
            [-s, h + 0.2, 0],
            [-s * 1.4, h, 0],
            [-s, h - 0.15, 0],
            [0, h, 0],
          ];
          break;
      }

      const curve = new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p)),
        true
      );

      const geo = new THREE.TubeGeometry(curve, 64, 0.08, 16, false);
      return new THREE.Mesh(geo, ribbonMaterial);
    }

    gift.add(createBowLoop("front"));
    gift.add(createBowLoop("back"));
    gift.add(createBowLoop("left"));
    gift.add(createBowLoop("right"));

    const knot = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      ribbonMaterial
    );
    knot.position.y = 1.55;
    gift.add(knot);

    /* ---------- CENTER ---------- */
    const box3 = new THREE.Box3().setFromObject(gift);
    const center = box3.getCenter(new THREE.Vector3());
    gift.position.sub(center);

    /* ---------- INTERACTION ---------- */
    let hover = false;
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const r = container.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };

    container.addEventListener("mouseenter", () => (hover = true));
    container.addEventListener("mouseleave", () => {
      hover = false;
      mouse.x = mouse.y = 0;
    });
    container.addEventListener("mousemove", onMouseMove);

    /* ---------- ANIMATION ---------- */
    const animate = () => {
      requestAnimationFrame(animate);
      gift.rotation.y += 0.002;
      gift.rotation.x += ((hover ? mouse.y * 0.4 : 0) - gift.rotation.x) * 0.08;
      gift.rotation.z += ((hover ? -mouse.x * 0.4 : 0) - gift.rotation.z) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    /* ---------- CLEANUP ---------- */
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [size, padding]);

  return (
    <div
      ref={mountRef}
      style={{
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        borderRadius: "30px",
        cursor: "pointer",
      }}
    />
  );
}
