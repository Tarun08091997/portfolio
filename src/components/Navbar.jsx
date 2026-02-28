import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 1)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Detect active section based on scroll position
      const sections = ["about", "skills", "projects", "certificates", "experience", "education", "contact"];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Account for navbar height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMenuOpen(false);
  };

  const navItems = [
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Certificates", id: "certificates" },
    { name: "Experience", id: "experience" },
    { name: "Education", id: "education" },
    { name: "Contact", id: "contact" }
  ];

  return (
    <motion.nav 
      className={`bg-white dark:bg-[#2E2E2E] border-b border-gray-200 dark:border-[#323232] transition-all duration-300 sticky top-0 z-50 ${
        scrolled ? "shadow-lg dark:shadow-xl" : "shadow-md dark:shadow-lg"
      }`}
      style={{ 
        backdropFilter: scrolled ? "blur(10px)" : "none",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo or Name */}
          <a 
            href="#about" 
            onClick={(e) => handleNavClick("about", e)}
            className="text-xl font-bold text-[#2563EB] dark:text-[#FF652F] hover:text-[#2563EB]/80 dark:hover:text-[#FF652F]/80 transition-colors duration-300 cursor-pointer"
          >
            Portfolio
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`text-[#1E1E1E] dark:text-[#F5F5F5] hover:text-[#2563EB] dark:hover:text-[#FF652F] transition-colors duration-300 cursor-pointer ${
                  activeSection === item.id ? "font-semibold text-[#2563EB] dark:text-[#FF652F]" : ""
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#1E1E1E] dark:text-[#F5F5F5] hover:text-[#2563EB] dark:hover:text-[#FF652F] focus:outline-none transition-colors duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-[#2E2E2E] transition-colors duration-300">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(item.id, e)}
              className={`block text-[#1E1E1E] dark:text-[#F5F5F5] hover:text-[#2563EB] dark:hover:text-[#FF652F] transition-colors duration-300 cursor-pointer ${
                activeSection === item.id ? "font-semibold text-[#2563EB] dark:text-[#FF652F]" : ""
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
