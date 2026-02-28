import { motion, useScroll, useTransform } from "framer-motion";
import Intro from "./Intro";
import FluidBackground from "./FluidBackground";

const About = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <FluidBackground />
      </motion.div>
      <div className="relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <Intro />
        </div>
      </div>
    </div>
  );
};

export default About;

