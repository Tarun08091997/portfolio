import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Intro = () => {
  const [description, setDescription] = useState([]);

  useEffect(() => {
    fetch("/data/description.json")
      .then((res) => res.json())
      .then((data) => setDescription(data.description || []))
      .catch((err) => console.error("Error loading description.json", err));
  }, []);

  return (
    <motion.section
      className="bg-transparent rounded-2xl p-8 md:p-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src="/images/profile.jpg"
            alt="Tarun Kumar"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full shadow-xl border-4 border-[#2563EB]/50 dark:border-[#FF652F]/40 transition-all duration-300 hover:scale-105"
          />
        </motion.div>
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mt-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Tarun Kumar
        </motion.h1>
        <div className="mt-6 space-y-3">
          {description.map((line, index) => (
            <motion.p
              key={index}
              className="text-base md:text-lg max-w-2xl mx-auto text-[#4A5568] dark:text-[#747474] leading-relaxed transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Intro;
