import "./App.css";
import "./components/brand/Logo.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "./components/Home";
import BookCall from "./components/BookCall";
import GrowthSurvey from "./components/GrowthSurvey";
import StrugglingToScale from "./components/StrugglingToScale";
import AuditForm from "./components/AuditForm";
import ThankYou from "./components/ThankYou";
import AdminDashboard from "./components/AdminDashboard";
import Work from "./components/Work";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import WebDesignJamaica from "./components/WebDesignJamaica";
import ScrollTriggerRefresh from "./components/ScrollTriggerRefresh";

ScrollTrigger.config({ ignoreMobileResize: true });

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollTriggerRefresh />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/growth-survey" element={<GrowthSurvey />} />
          <Route path="/struggling-to-scale" element={<StrugglingToScale />} />
          <Route path="/audit" element={<AuditForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/web-design-jamaica" element={<WebDesignJamaica />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
