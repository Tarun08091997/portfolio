import { useEffect, useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects.json", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Projects
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md"
          >
            {/* Project Name */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {project.name || "Untitled Project"}
            </h3>

            {/* Project About */}
            {project.about && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                {project.about}
              </p>
            )}

            {/* Skills */}
            {project.skills?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {project.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
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
                    className="h-32 w-auto rounded"
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
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 underline"
                >
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
