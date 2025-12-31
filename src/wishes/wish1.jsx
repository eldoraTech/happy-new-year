import { useEffect, useState } from "react";

import SkyRocketFireworksCanvas from "../components2D/Fireworks/SkyRocketFireworksCanvas";
import FullScreenBalloonsCanvas_WithTimeLimt from "../components2D/Balloons/FullScreenBalloonsCanvas_WithTimeLimt";
import ConfettiRepelCanvas from "../components2D/Confetti/ConfettiRepelCanvas";
import Card1 from "../components2D/cards/card1";
import BalloonsCanvas from "../components2D/Balloons/BalloonsCanvas";
import ConfettiClickBlastCanvas from "../components2D/Confetti/ConfettiClickBlastCanvas";

export default function Wish_1() {
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
    <div style={{background: "radial-gradient(circle at center, #001A33, #004C99)", height: "100vh", width: "100vw", overflow: "hidden", position: "relative", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      {step >= 0 && <SkyRocketFireworksCanvas />}

      {step >= 1 && <FullScreenBalloonsCanvas_WithTimeLimt />}

      {step >= 2 && <ConfettiRepelCanvas />}

      {step >= 3 && <Card1/> }

      {step >= 4 && <BalloonsCanvas />}

      {step >= 4 && <ConfettiClickBlastCanvas />}

    </div>
  );
}


