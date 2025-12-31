import { useEffect, useState } from "react";

import SkyRocketFireworksCanvas from "../components2D/Fireworks/SkyRocketFireworksCanvas";
import FullScreenBalloonsCanvas_WithTimeLimt from "../components2D/Balloons/FullScreenBalloonsCanvas_WithTimeLimt";
import GlowingStarsCanvas from "../components2D/Sky/GlowingStarsCanvas";
import GravityBallsCanvas from "../components2D/Physics/GravityBallsCanvas";
import ConfettiClickBlastCanvas from "../components2D/Confetti/ConfettiClickBlastCanvas";
import Card2 from "../components2D/cards/card2";

export default function Wish_4() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 5000);      
    const t2 = setTimeout(() => setStep(2), 10000); 
    const t3 = setTimeout(() => setStep(3), 25000); 
    const t4 = setTimeout(() => setStep(4), 20000); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div style={{background: "radial-gradient(circle at center, #000000ff, #000126ff)",height: "100vh", width: "100vw", overflow: "hidden", position: "relative",justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      
      {step >= 0 && <GlowingStarsCanvas starCount={200} />}

      {step >= 0 && <SkyRocketFireworksCanvas />}

      {step >= 1 && <FullScreenBalloonsCanvas_WithTimeLimt />}

      {step >= 2 && <Card2/> }

      {step >= 3 && <GravityBallsCanvas />}

      {step >= 4 && <ConfettiClickBlastCanvas />}

    </div>
  );
}


