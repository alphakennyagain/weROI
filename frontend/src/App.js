import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookCall from "./components/BookCall";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-call" element={<BookCall />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;