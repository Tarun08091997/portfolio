import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const Education = () => {
  const education = [
    {
      institution: "Lovely Professional University – Ludhiana, Punjab",
      degree: "M.Tech Computer Science",
      gpa: "9.08",
      duration: "Sept 2021 – July 2023",
    },
    {
      institution: "NIT, Agartala – Agartala, Tripura",
      degree: "B.Tech ECE",
      gpa: "8.01",
      duration: "Aug 2016 – June 2020",
    },
  ];

  return (
    <motion.section
      className="bg-transparent rounded-2xl p-8 md:p-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-3 rounded-lg bg-[#2563EB]/10 dark:bg-[#FF652F]/20">
          <FaGraduationCap className="text-2xl text-[#2563EB] dark:text-[#FF652F]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
          Education
        </h2>
      </motion.div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A] hover:border-[#2563EB]/50 dark:hover:border-[#FF652F]/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
                  {edu.institution}
                </h3>
                <p className="text-base text-[#4A5568] dark:text-[#747474] transition-colors duration-300 mt-1">
                  {edu.degree}
                </p>
                <p className="text-sm text-[#2563EB] dark:text-[#FF652F] font-medium mt-2">
                  GPA: {edu.gpa}
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#2563EB]/10 dark:bg-[#FF652F]/20 border border-[#2563EB]/20 dark:border-[#FF652F]/20">
                <p className="text-sm font-medium text-[#2563EB] dark:text-[#FF652F] whitespace-nowrap">
                  {edu.duration}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Education;

