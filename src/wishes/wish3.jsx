import { useEffect, useState } from "react";

import SkyRocketFireworksCanvas from "../components2D/Fireworks/SkyRocketFireworksCanvas";
import BorderLightsCanvas from "../components2D/light/BorderLightsCanvas";
import BalloonRepelCanvas from "../components2D/Balloons/BalloonRepelCanvas";
import NewYearCanvas from "../components2D/HeroText/NewYearCanvas";
import ConfettiClickBlastCanvas from "../components2D/Confetti/ConfettiClickBlastCanvas";
import SnowflakeCanvas from "../components2D/Snow/SnowflakeCanvas";

export default function Wish_3() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 5000);      
    const t2 = setTimeout(() => setStep(2), 10000); 
    const t3 = setTimeout(() => setStep(3), 15000); 
    const t4 = setTimeout(() => setStep(4), 20000); 

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div style={{background: "radial-gradient(circle at center, #382600ff, #270101ff)",height: "100vh", width: "100vw", overflow: "hidden", position: "relative",justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      
      {step >= 0 && <BorderLightsCanvas />}

      {step >= 0 && <SkyRocketFireworksCanvas />}

      {step >= 1 && <BalloonRepelCanvas NoOfBalloons={10} />}

      {step >= 2 && <NewYearCanvas/> }

      {step >= 0 && <SnowflakeCanvas />}

      {step >= 4 && <ConfettiClickBlastCanvas />}

    </div>
  );
}


