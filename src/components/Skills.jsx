import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SiJavascript, SiPython, SiC, SiCplusplus,
  SiReact, SiNodedotjs, SiExpress, SiTailwindcss, SiCss3,
  SiMongodb, SiMysql, SiPostgresql,
  SiGit, SiPostman, SiDocker, SiKubernetes,
  SiJsonwebtokens, SiVscodium
} from "react-icons/si";
import { FaJava, FaMobileAlt, FaTools } from "react-icons/fa";

const iconMap = {
  "JavaScript": <SiJavascript className="text-yellow-500" />,
  "Python": <SiPython className="text-blue-500" />,
  "Java": <FaJava className="text-red-500" />,
  "C": <SiC className="text-blue-600" />,
  "C++": <SiCplusplus className="text-blue-400" />,

  "React": <SiReact className="text-cyan-400" />,
  "Node.js": <SiNodedotjs className="text-green-500" />,
  "Express.js": <SiExpress className="text-gray-500" />,
  "Tailwind": <SiTailwindcss className="text-sky-400" />,
  "CSS": <SiCss3 className="text-blue-600" />,

  "MongoDB": <SiMongodb className="text-green-600" />,
  "MySQL": <SiMysql className="text-blue-500" />,
  "PostgreSQL": <SiPostgresql className="text-indigo-500" />,

  "Git": <SiGit className="text-orange-500" />,
  "Visual Studio Code": <SiVscodium className="text-blue-400" />,
  "Postman": <SiPostman className="text-orange-600" />,

  "REST APIs": <SiJsonwebtokens className="text-gray-600" />,
  "JWT Auth": <SiJsonwebtokens className="text-purple-500" />,
  "Responsive Design": <FaMobileAlt className="text-pink-500" />,
  "CI/CD": <FaTools className="text-green-700" />,
  "Docker": <SiDocker className="text-blue-500" />,
  "Kubernetes": <SiKubernetes className="text-blue-400" />,
};

// different speeds for rows
const rowDurations = [20, 24, 28, 32, 36];

const Skills = () => {
  const [skills, setSkills] = useState({});

  useEffect(() => {
    fetch("/data/skills.json")
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error("Error loading skills.json", err));
  }, []);

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
        My Skills
      </h2>

      {Object.entries(skills).map(([category, items], index) => {
        const duration = rowDurations[index % rowDurations.length];
        const repeatedItems = [...items, ...items , ...items , ...items]; // Repeat items for continuous scrolling

        return (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold text-center text-indigo-600 dark:text-indigo-400 mb-4">
              {category}
            </h3>

            <div className="overflow-hidden w-full relative h-20">
              <motion.div
                className="flex gap-6 absolute"
                style={{ width: "max-content" }}
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {repeatedItems.map((skill, i) => (
                  <div
                    key={`${skill}-${i}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-gray-800 dark:text-gray-200 min-w-fit"
                  >
                    <span className="text-2xl">{iconMap[skill] || "❓"}</span>
                    <span className="text-base font-medium whitespace-nowrap">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default Skills;
