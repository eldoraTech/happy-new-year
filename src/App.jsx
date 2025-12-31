import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navigation from "./Navigation";

import Wish_1 from "./wishes/wish1";
import Wish_2 from "./wishes/wish2";
import Wish_3 from "./wishes/wish3";
import Wish_4 from "./wishes/wish4";
import Wish_5 from "./wishes/wish5";
import Wish_6 from "./wishes/wish6";
import Wish_7 from "./wishes/wish7";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigation />} />
        
        <Route path="/wish-1" element={<Wish_1 />} />
        <Route path="/wish-2" element={<Wish_2 />} />
        <Route path="/wish-3" element={<Wish_3 />} />
        <Route path="/wish-4" element={<Wish_4 />} />
        <Route path="/wish-5" element={<Wish_5 />} />
        <Route path="/wish-6" element={<Wish_6 />} />
        <Route path="/wish-7" element={<Wish_7 />} />
      </Routes>
    </Router>
  );
}

export default App;
