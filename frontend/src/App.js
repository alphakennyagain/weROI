import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookCall from "./components/BookCall";
import GrowthSurvey from "./components/GrowthSurvey";
import StrugglingToScale from "./components/StrugglingToScale";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/growth-survey" element={<GrowthSurvey />} />
          <Route path="/struggling-to-scale" element={<StrugglingToScale />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
