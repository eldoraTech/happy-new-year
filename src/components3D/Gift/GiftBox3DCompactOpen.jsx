import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function GiftBox3DCompactOpen({ size = "large", padding = 0.9 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SIZE ---------- */
    const SIZE_MAP = { verysmall: 120, small: 220, medium: 320, large: 420 };
    const CANVAS_SIZE = SIZE_MAP[size] || 320;
    container.style.width = `${CANVAS_SIZE}px`;
    container.style.height = `${CANVAS_SIZE}px`;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(45, 1, 0.2, 100);
    camera.position.set(0, 1.4 * padding, 6 * padding);
    camera.lookAt(0, -0.5, 0);

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(6, 6, 6);
    scene.add(keyLight);

    /* ---------- MATERIALS ---------- */
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd10000 });
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffd400 });

    /* ---------- GIFT GROUP ---------- */
    const gift = new THREE.Group();
    scene.add(gift);

    /* ---------- BOX ---------- */
    gift.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 2.5), boxMat));

    /* ---------- LID ---------- */
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.4, 2.6),
      boxMat
    );
    lid.position.y = 1.2;
    gift.add(lid);

    /* ---------- RIBBON GROUP ---------- */
    const ribbonGroup = new THREE.Group();
    gift.add(ribbonGroup);

    ribbonGroup.add(
      new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.05, 2.55), ribbonMat)
    );
    ribbonGroup.add(
      new THREE.Mesh(new THREE.BoxGeometry(2.55, 2.05, 0.3), ribbonMat)
    );

    /* ---------- CONFETTI ---------- */
    const confettiGroup = new THREE.Group();
    scene.add(confettiGroup);
    const confetti = [];

    for (let i = 0; i < 140; i++) {
      const geo = new THREE.PlaneGeometry(0.15, 0.15);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 360},100%,60%)`),
        side: THREE.DoubleSide,
      });
      const piece = new THREE.Mesh(geo, mat);
      piece.position.set(0, 0.7, 0);
      piece.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.18,
        Math.random() * 0.35 + 0.2,
        (Math.random() - 0.5) * 0.18
      );
      confettiGroup.add(piece);
      confetti.push(piece);
    }

    gift.position.y = -0.3;

    /* ---------- STATES ---------- */
    let ribbonRemoved = false;
    let boxOpened = false;
    let hover = false;
    const mouse = { x: 0, y: 0 };

    /* ---------- INTERACTION ---------- */
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

    /* ---------- CLICK → REMOVE RIBBON ---------- */
    const removeRibbon = () => {
      if (ribbonRemoved) return;
      ribbonRemoved = true;

      gsap.to(ribbonGroup.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => gift.remove(ribbonGroup),
      });
    };

    /* ---------- DOUBLE CLICK → OPEN BOX ---------- */
    const openBox = () => {
      if (boxOpened) return;
      boxOpened = true;

      // anticipation shake
      gsap.to(gift.position, {
        x: 0.05,
        repeat: 6,
        yoyo: true,
        duration: 0.05,
      });

      gsap.to(lid.position, {
        y: 3,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(lid.rotation, {
        x: -Math.PI / 3,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    };

    container.addEventListener("click", removeRibbon);
    container.addEventListener("dblclick", openBox);

    /* ---------- LOOP ---------- */
    const animate = () => {
      requestAnimationFrame(animate);

      gift.rotation.y += 0.002;
      gift.rotation.x += ((hover ? mouse.y * 0.3 : 0) - gift.rotation.x) * 0.06;
      gift.rotation.z += ((hover ? -mouse.x * 0.3 : 0) - gift.rotation.z) * 0.06;

      if (boxOpened) {
        confetti.forEach((p) => {
          p.userData.velocity.y -= 0.008;
          p.position.add(p.userData.velocity);
          p.rotation.x += 0.12;
          p.rotation.y += 0.12;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ---------- CLEANUP ---------- */
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("click", removeRibbon);
      container.removeEventListener("dblclick", openBox);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [size, padding]);

  return (
    <div
      ref={mountRef}
      style={{
        margin: "0 auto",
        background: "black",
        borderRadius: "30px",
        cursor: "pointer",
      }}
    />
  );
}
