import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("AI and Machine Learning");

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects.json", err));
  }, []);

  // Group projects by category
  const aiProjects = projects.filter((p) => p.category === "AI and Machine Learning");
  const webProjects = projects.filter((p) => p.category === "Web Development");

  // Get current projects based on active tab
  const currentProjects = activeTab === "AI and Machine Learning" ? aiProjects : webProjects;

  const ProjectCard = ({ project, idx }) => {
    const isAIProject = project.category === "AI and Machine Learning";
    
    return (
    <motion.div
      key={idx}
      className={`
        bg-white dark:bg-[#2E2E2E] p-5 rounded-xl shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300
        border-l-4 border-[#2563EB] dark:border-[#FF652F]
        hover:scale-[1.02] transform
      `}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
    >
      {/* Project Name */}
      <h3 className="text-xl font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
        {project.name || "Untitled Project"}
        {project.skills?.length > 0 && (
          <span className="text-base font-normal italic text-[#4A5568] dark:text-[#747474] ml-2">
            ({project.skills.join(", ")})
          </span>
        )}
      </h3>

      {/* Project About */}
      {project.about && (
        <p className="text-[#4A5568] dark:text-[#747474] mt-2 text-sm transition-colors duration-300">
          {project.about}
        </p>
      )}

      {/* Skills */}
      {project.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {project.skills.map((skill, i) => {
            return (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md font-medium transition-all duration-300 bg-[#F5F7FA] dark:bg-[#323232] text-[#1E1E1E] dark:text-[#F5F5F5] border border-gray-200 dark:border-[#323232] hover:border-[#2563EB]/50 dark:hover:border-[#FF652F]/50"
              >
                {skill}
              </span>
            );
          })}
        </div>
      )}

      {/* Images */}
      {project.images?.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {project.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Project screenshot"
              className="h-32 w-auto rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Links */}
      <div className="mt-4 flex gap-4 text-sm">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium px-3 py-1.5 rounded-md bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/20 dark:bg-[#FF652F]/20 dark:text-[#FF652F] dark:hover:bg-[#FF652F]/30 transition-all duration-300 hover:shadow-sm"
          >
            GitHub
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium px-3 py-1.5 rounded-md bg-[#14A76C]/10 text-[#14A76C] hover:bg-[#14A76C]/20 dark:bg-[#14A76C]/20 dark:text-[#14A76C] dark:hover:bg-[#14A76C]/30 transition-all duration-300 hover:shadow-sm"
          >
            Live
          </a>
        )}
      </div>
    </motion.div>
    );
  };

  const tabs = [
    { id: "AI and Machine Learning", label: "AI and Machine Learning", count: aiProjects.length },
    { id: "Web Development", label: "Web Development", count: webProjects.length },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <motion.h2 
        className="text-3xl font-bold mb-8 text-[#2563EB] dark:text-[#FF652F] transition-colors duration-300"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Projects
      </motion.h2>

      {/* Tabs */}
      <motion.div 
        className="border-b border-gray-200 dark:border-[#323232] mb-6 transition-colors duration-300"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
      >
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isAITab = tab.id === "AI and Machine Learning";
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 relative
                  ${
                    isActive
                      ? "border-[#2563EB] text-[#2563EB] dark:border-[#FF652F] dark:text-[#FF652F]"
                      : "border-transparent text-[#4A5568] dark:text-[#747474] hover:text-[#1E1E1E] dark:hover:text-[#F5F5F5] hover:border-gray-300 dark:hover:border-[#323232]"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    ml-2 py-0.5 px-2.5 rounded-full text-xs font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#FF652F]/20 dark:text-[#FF652F] shadow-sm"
                        : "bg-[#F5F7FA] text-[#4A5568] dark:bg-[#323232] dark:text-[#747474]"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProjects.map((project, idx) => (
          <ProjectCard key={idx} project={project} idx={idx} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
