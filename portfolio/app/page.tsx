import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import BentoProjects from "@/components/BentoProjects";
import About from "@/components/About";
import CyberSection from "@/components/CyberSection";
import ResourcesHub from "@/components/ResourcesHub";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="grain">
      <Navbar />
      <main>
        <Hero />
        <SkillsMarquee />
        <BentoProjects />
        <About />
        <CyberSection />
        <ResourcesHub />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
