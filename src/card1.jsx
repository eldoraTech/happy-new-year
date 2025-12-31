import React from "react";

import Any3D_Number from "./components3D/number/Any3D_Number";
import Any3D_Alphabet from "./components3D/Alphabets/Any3D_Alphabet";
import Any3D_Alphabet1 from "./components3D/Alphabets/Any3D_Alphabet1";

export default function Card1() {
  return (
    <>
    <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Any3D_Alphabet1 value="H" />
        <Any3D_Alphabet1 value="A" />
        <Any3D_Alphabet1 value="P" />
        <Any3D_Alphabet1 value="P" />
        <Any3D_Alphabet1 value="Y" />
        <div style={{padding:"10px"}}></div>

        <Any3D_Alphabet value="N" />
        <Any3D_Alphabet value="E" />
        <Any3D_Alphabet value="W" padding={1.3} />

        <div style={{padding:"10px"}}></div>

        <Any3D_Alphabet value="Y" />
        <Any3D_Alphabet value="E" />
        <Any3D_Alphabet value="A" />
        <Any3D_Alphabet value="R" />


    </div>
    
    <div style={{padding:"10px"}}></div>

    <div style={{ display: "flex", flexWrap: "wrap",justifyContent: "center" }}>
        <Any3D_Number value="2" />
        <Any3D_Number value="0" />
        <Any3D_Number value="2" />
        <Any3D_Number value="6" />
    </div>
    </>
  );
}



