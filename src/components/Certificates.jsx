import { useEffect, useState } from "react";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetch("/data/certificates.json")
      .then((res) => res.json())
      .then((data) => setCertificates(data))
      .catch((err) => console.error("Error loading certificates.json", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Certificates
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {cert.title || "Untitled Certificate"}
            </h3>

            {/* Issuer and Issued Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cert.issuer && <>Issued by: <span className="font-medium">{cert.issuer}</span></>}
              {cert.issuedOn && <span className="block">Issued: {cert.issuedOn}</span>}
            </p>

            {/* Skills */}
            {cert.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm my-3">
                {cert.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Certificate Image */}
            {cert.images?.length > 0 && (
              <div className="mt-3">
                <img
                  src={cert.images[0]}
                  alt="Certificate"
                  className="rounded h-40 w-auto object-contain"
                />
              </div>
            )}

            {/* View Certificate Link */}
            {cert.link && (
              <div className="mt-4">
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline text-sm font-medium"
                >
                  View Certificate
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;
