import "./App.css";
import "./components/brand/Logo.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "./components/Home";
import BookCall from "./components/BookCall";
import GrowthSurvey from "./components/GrowthSurvey";
import StrugglingToScale from "./components/StrugglingToScale";
import GrowthPreview from "./components/GrowthPreview";
import ThankYou from "./components/ThankYou";
import AdminDashboard from "./components/AdminDashboard";
import Work from "./components/Work";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import WebDesignJamaica from "./components/WebDesignJamaica";
import ScrollTriggerRefresh from "./components/ScrollTriggerRefresh";
import GrowthIQChat from "./components/GrowthIQChat";
import ExitIntentPopup from "./components/ExitIntentPopup";
import { useLocation } from "react-router-dom";

ScrollTrigger.config({ ignoreMobileResize: true });

function SiteExitPopup() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return <ExitIntentPopup />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollTriggerRefresh />
        <SiteExitPopup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/growth-preview" element={<GrowthPreview />} />
          <Route path="/growthiq" element={<Navigate to="/growth-preview" replace />} />
          <Route path="/audit" element={<Navigate to="/growth-preview" replace />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/growth-survey" element={<GrowthSurvey />} />
          <Route path="/struggling-to-scale" element={<StrugglingToScale />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/web-design-jamaica" element={<WebDesignJamaica />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <GrowthIQChat />
      </BrowserRouter>
    </div>
  );
}

export default App;
