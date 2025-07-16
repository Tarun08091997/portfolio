import { motion } from "framer-motion";

const Intro = () => {
  return (
    <motion.div
      className="text-center py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src="/images/profile.jpg"
        alt="Tarun Kumar"
        className="w-40 h-40 mx-auto rounded-full shadow-lg border-4 border-indigo-500/50"
      />
      <h1 className="text-4xl font-extrabold mt-6 text-gray-900 dark:text-white">
        Tarun Kumar
      </h1>
      <p className="mt-3 text-lg max-w-xl mx-auto text-gray-600 dark:text-gray-300">
        I thrive on solving real-world problems through the lens of computer science.
        Passionate about clean design and building full-stack applications that make a difference.
      </p>
    </motion.div>
  );
};

export default Intro;
