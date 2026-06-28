import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import Spotlight from "@/components/Spotlight";
import About from "@/components/About";
import SkillsToolkit from "@/components/SkillsToolkit";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <SkillsMarquee />
        <Spotlight />
        <About />
        <SkillsToolkit />
        <Achievements />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
