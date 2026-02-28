import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SiJavascript, SiPython, SiC, SiCplusplus,
  SiReact, SiNodedotjs, SiExpress, SiTailwindcss, SiCss3,
  SiMongodb, SiMysql, SiPostgresql,
  SiGit, SiPostman, SiDocker, SiKubernetes,
  SiJsonwebtokens, SiVscodium, SiTensorflow, SiPytorch,
  SiOpencv, SiPandas, SiNumpy, SiJupyter
} from "react-icons/si";
import { FaJava, FaMobileAlt, FaTools, FaBrain, FaEye, FaChartLine, FaRobot } from "react-icons/fa";

const iconMap = {
  // Languages
  "JavaScript": <SiJavascript className="text-yellow-500" />,
  "Python": <SiPython className="text-blue-500" />,
  "Java": <FaJava className="text-red-500" />,
  "C": <SiC className="text-blue-600" />,
  "C++": <SiCplusplus className="text-blue-400" />,

  // AI & ML Frameworks
  "TensorFlow": <SiTensorflow className="text-orange-500" />,
  "PyTorch": <SiPytorch className="text-red-500" />,
  "Keras": <FaBrain className="text-red-600" />,
  "scikit-learn": <FaRobot className="text-orange-600" />,
  "OpenCV": <SiOpencv className="text-green-500" />,

  // Data Science
  "pandas": <SiPandas className="text-blue-600" />,
  "NumPy": <SiNumpy className="text-blue-400" />,
  "Jupyter": <SiJupyter className="text-orange-500" />,
  "Matplotlib": <FaChartLine className="text-blue-500" />,
  "Seaborn": <FaChartLine className="text-purple-500" />,

  // Computer Vision & AI Concepts
  "Computer Vision": <FaEye className="text-cyan-500" />,
  "Deep Learning": <FaBrain className="text-purple-600" />,
  "Neural Networks": <FaBrain className="text-indigo-500" />,
  "Image Processing": <FaEye className="text-green-600" />,
  "OCR": <FaEye className="text-blue-500" />,
  "Face Recognition": <FaEye className="text-pink-500" />,
  "Object Detection": <FaEye className="text-yellow-600" />,
  "YOLO": <FaEye className="text-red-500" />,
  "Image Classification": <FaEye className="text-indigo-400" />,
  "Feature Extraction": <FaBrain className="text-teal-500" />,
  "NLP": <FaBrain className="text-green-500" />,
  "Named Entity Recognition": <FaBrain className="text-blue-700" />,
  "Time Series Forecasting": <FaChartLine className="text-green-600" />,
  "Data Analysis": <FaChartLine className="text-blue-600" />,
  "Statistical Modeling": <FaChartLine className="text-purple-600" />,
  "Real-time Processing": <FaRobot className="text-cyan-600" />,

  // Web Development
  "React": <SiReact className="text-cyan-400" />,
  "Node.js": <SiNodedotjs className="text-green-500" />,
  "Express.js": <SiExpress className="text-gray-500" />,
  "Tailwind": <SiTailwindcss className="text-sky-400" />,
  "CSS": <SiCss3 className="text-blue-600" />,

  // Databases
  "MongoDB": <SiMongodb className="text-green-600" />,
  "MySQL": <SiMysql className="text-blue-500" />,
  "PostgreSQL": <SiPostgresql className="text-indigo-500" />,

  // Development Tools
  "Git": <SiGit className="text-orange-500" />,
  "Visual Studio Code": <SiVscodium className="text-blue-400" />,
  "Postman": <SiPostman className="text-orange-600" />,
  "Docker": <SiDocker className="text-blue-500" />,
  "Kubernetes": <SiKubernetes className="text-blue-400" />,
  "CI/CD": <FaTools className="text-green-700" />,
  "REST APIs": <SiJsonwebtokens className="text-gray-600" />,
  "JWT Auth": <SiJsonwebtokens className="text-purple-500" />,
  "Responsive Design": <FaMobileAlt className="text-pink-500" />,
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
      className="w-full bg-transparent p-5 md:p-6 rounded-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2 
        className="text-3xl font-extrabold text-center text-[#1E1E1E] dark:text-[#F5F5F5] mb-6 transition-colors duration-300"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        My Skills
      </motion.h2>

      {Object.entries(skills).map(([category, items], index) => {
        const duration = rowDurations[index % rowDurations.length];
        const repeatedItems = [...items, ...items , ...items , ...items]; // Repeat items for continuous scrolling

        return (
          <motion.div 
            key={category} 
            className="mb-7 last:mb-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
          >
            <h3 className="text-xl font-semibold text-center text-[#2563EB] dark:text-[#FF652F] mb-2 transition-colors duration-300">
              {category}
            </h3>

            <div className="overflow-hidden w-full relative h-14">
              <motion.div
                className="flex gap-4 absolute"
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F7FA] dark:bg-[#323232] border border-gray-200 dark:border-[#323232] rounded-xl shadow-sm text-[#1E1E1E] dark:text-[#F5F5F5] min-w-fit hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-xl">{iconMap[skill] || "?"}</span>
                    <span className="text-base font-medium whitespace-nowrap">
                      {skill}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Skills;
