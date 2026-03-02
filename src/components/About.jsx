import Intro from "./Intro";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <Intro />
        </div>
      </div>
    </div>
  );
};

export default About;
