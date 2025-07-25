import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BubblePage from "./pages/BubblePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color/:colorName/:topic" element={<BubblePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
