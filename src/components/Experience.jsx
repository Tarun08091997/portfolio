import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch("/data/experience.json")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error loading experience.json", err));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <motion.h2 
        className="text-3xl font-bold text-[#2563EB] dark:text-[#FF652F] mb-6 transition-colors duration-300"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Experience
      </motion.h2>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-[#2E2E2E] p-6 rounded-xl shadow-md dark:shadow-lg border-l-4 border-[#2563EB] dark:border-[#FF652F] hover:shadow-lg dark:hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
                  {exp.role || "Job Title"}
                </h3>
                <p className="text-[#4A5568] dark:text-[#747474] transition-colors duration-300">
                  {exp.company || "Company Name"}
                </p>
              </div>
              <p className="text-sm text-[#4A5568] dark:text-[#747474] transition-colors duration-300 whitespace-nowrap ml-4">
                {exp.duration || "Duration"}
              </p>
            </div>
            <ul className="list-disc ml-5 mt-3 space-y-2 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
              {exp.responsibilities?.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
