import NewYear3DResponsiveCopy from "../components2D/HeroText/NewYear3DResponsive copy.jsx";
import MultiLayerFireworksCanvas from "../components2D/Fireworks/MultiLayerFireworksCanvas";
import GalaxySwirlCanvas from "../components2D/Sky/GalaxySwirlCanvas";
import ShootingStarsCanvas from "../components2D/Sky/ShootingStarsCanvas";
import BorderLightsCanvas from "../components2D/light/BorderLightsCanvas.jsx";
import SparkleGlowConfettiCanvas from "../components2D/Confetti/SparkleGlowConfettiCanvas.jsx";

export default function Wish_6() {
  return (
    <div style={{background: "radial-gradient(circle at center, #000000, #000000)",height: "100vh", width: "100vw", overflow: "hidden", position: "relative",justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <SparkleGlowConfettiCanvas />
      <ShootingStarsCanvas starCount={100} meteorCount={6} />
      <BorderLightsCanvas />
      <GalaxySwirlCanvas starCount={400} />
      <NewYear3DResponsiveCopy />
      <MultiLayerFireworksCanvas/>
    </div>
  );
}


