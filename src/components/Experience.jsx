import { useEffect, useState } from "react";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch("/data/experience.json")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error("Error loading experience.json", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        Experience
      </h2>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-indigo-600 dark:border-indigo-400"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {exp.role || "Job Title"}
                </h3>
                <p className="text-gray-500 dark:text-gray-300">
                  {exp.company || "Company Name"}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {exp.duration || "Duration"}
              </p>
            </div>
            <ul className="list-disc ml-5 mt-3 space-y-2 text-gray-700 dark:text-gray-200">
              {exp.responsibilities?.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
