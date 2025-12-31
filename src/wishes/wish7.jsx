// import NewYear3DResponsiveCopy from "../components2D/HeroText/NewYear3DResponsive copy.jsx";
import MultiLayerFireworksCanvas from "../components2D/Fireworks/MultiLayerFireworksCanvas.jsx";
import GalaxySwirlCanvas from "../components2D/Sky/GalaxySwirlCanvas.jsx";
// import ShootingStarsCanvas from "../components2D/Sky/ShootingStarsCanvas.jsx";
// import BorderLightsCanvas from "../components2D/light/BorderLightsCanvas.jsx";
import SparkleGlowConfettiCanvas from "../components2D/Confetti/SparkleGlowConfettiCanvas.jsx";

import SkyRocketFireworksCanvas from "../components2D/Fireworks/SkyRocketFireworksCanvas";
import ConfettiClickBlastCanvas from "../components2D/Confetti/ConfettiClickBlastCanvas";
import NewYearUltraInteractive from '../components2D/HeroText/NewYearUltraInteractive';

import AdjustableTwistedRibbon3D from "../components3D/Ribbon/AdjustableTwistedRibbon3D.jsx";
export default function Wish_7() {
  return (
    <div style={{background: "radial-gradient(circle at center, #000000, #000000)",height: "100vh", width: "100vw", overflow: "hidden", position: "relative",justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <SparkleGlowConfettiCanvas />
      <SkyRocketFireworksCanvas />
      <ConfettiClickBlastCanvas />
      <GalaxySwirlCanvas starCount={400} />
      <NewYearUltraInteractive />
      <MultiLayerFireworksCanvas/>
      <div style={{width: "100%", display: "flex", justifyContent:"space-between"}}>
      <AdjustableTwistedRibbon3D colorTop="#00cc00" colorBottom="#0066ff" />
      <AdjustableTwistedRibbon3D colorTop="#0066ff" colorBottom="#e607fa"/>
    </div>
    </div>
  );
}


