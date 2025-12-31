import NewYear3DResponsive from '../components2D/HeroText/NewYear3DResponsive';
import MultiLayerFireworksCanvas from "../components2D/Fireworks/MultiLayerFireworksCanvas";
import SnowCanvas from '../components2D/Snow/SnowCanvas';
import GalaxySwirlCanvas from "../components2D/Sky/GalaxySwirlCanvas";
import ShootingStarsCanvas from "../components2D/Sky/ShootingStarsCanvas";
import DecorativeLightsCanvas from "../components2D/light/DecorativeLightsCanvas";


export default function Wish_5() {
  return (
    <div style={{background: "radial-gradient(circle at center, #000000, #000000)",height: "100vh", width: "100vw", overflow: "hidden", position: "relative",justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <SnowCanvas />
      <ShootingStarsCanvas starCount={100} meteorCount={6} />
      <DecorativeLightsCanvas />
      <GalaxySwirlCanvas starCount={400} />
      <NewYear3DResponsive />
      <MultiLayerFireworksCanvas/>
    </div>
  );
}


