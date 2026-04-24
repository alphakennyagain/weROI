import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import BookCall from "./components/BookCall";
import GrowthSurvey from "./components/GrowthSurvey";
import StrugglingToScale from "./components/StrugglingToScale";
import AuditForm from "./components/AuditForm";
import ThankYou from "./components/ThankYou";
import AdminDashboard from "./components/AdminDashboard";
import Work from "./components/Work";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/growth-survey" element={<GrowthSurvey />} />
          <Route path="/struggling-to-scale" element={<StrugglingToScale />} />
          <Route path="/audit" element={<AuditForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/work" element={<Work />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
