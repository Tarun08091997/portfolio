import { useEffect } from "react";
import Intro from "./Intro";
import Skills from "./Skills";
import Projects from "./Projects";
import Certificates from "./Certificates";
import Experience from "./Experience";
import Education from "./Education";
import Contact from "./Contact";
import FluidBackground from "./FluidBackground";

const HomePage = () => {
  useEffect(() => {
    // Handle hash navigation on page load
    const handleHashNavigation = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setTimeout(() => {
          const section = document.getElementById(hash);
          if (section) {
            const offset = 80; // Account for navbar height
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);
    return () => window.removeEventListener("hashchange", handleHashNavigation);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <FluidBackground />
      </div>
      <div className="relative z-10">
        {/* About Section */}
        <section id="about" className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full">
            <Intro />
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <Skills />
        </section>

        {/* Projects Section */}
        <section id="projects" className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <Projects />
        </section>

        {/* Certificates Section */}
        <section id="certificates" className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <Certificates />
        </section>

        {/* Experience Section */}
        <section id="experience" className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <Experience />
        </section>

        {/* Education Section */}
        <section id="education" className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <Education />
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <Contact />
        </section>
      </div>
    </div>
  );
};

export default HomePage;

