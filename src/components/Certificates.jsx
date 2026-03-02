import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetch("/data/certificates.json")
      .then((res) => res.json())
      .then((data) => setCertificates(data))
      .catch((err) => console.error("Error loading certificates.json", err));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-[#2563EB] dark:text-[#FF652F] transition-colors duration-300"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Certificates
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => (
          <motion.div 
            key={idx} 
            className="bg-white dark:bg-[#2E2E2E] p-5 rounded-xl shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:scale-[1.2] hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
            onClick={() => setSelectedCertificate(cert)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedCertificate(cert);
              }
            }}
          >
            {/* Title */}
            <h3 className="text-xl font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] mb-1 transition-colors duration-300">
              {cert.title || "Untitled Certificate"}
            </h3>

            {/* Issuer and Issued Date */}
            <p className="text-sm text-[#4A5568] dark:text-[#747474] transition-colors duration-300">
              {cert.issuer && <>Issued by: <span className="font-medium">{cert.issuer}</span></>}
              {cert.issuedOn && <span className="block">Issued: {cert.issuedOn}</span>}
            </p>

            {/* Skills */}
            {cert.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm my-3">
                {cert.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#FFE400]/20 dark:bg-[#FFE400]/10 text-[#1E1E1E] dark:text-[#FFE400] px-2 py-1 rounded-md border border-[#FFE400]/30 dark:border-[#FFE400]/20 transition-colors duration-300"
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
                  className="rounded-lg h-40 w-auto object-contain"
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
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#2563EB] dark:text-[#FF652F] hover:text-[#2563EB]/80 dark:hover:text-[#FF652F]/80 underline text-sm font-medium transition-colors duration-300 hover:underline-offset-2"
                >
                  View Certificate
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="relative w-[80vw] h-[80vh] bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl overflow-y-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              className="sticky top-0 ml-auto block px-3 py-1 rounded-md bg-[#2563EB]/10 dark:bg-[#FF652F]/20 text-[#2563EB] dark:text-[#FF652F] font-semibold hover:bg-[#2563EB]/20 dark:hover:bg-[#FF652F]/30 transition-colors duration-300"
            >
              Close
            </button>

            <h3 className="text-2xl font-bold text-[#1E1E1E] dark:text-[#F5F5F5] mt-4">
              {selectedCertificate.title || "Untitled Certificate"}
            </h3>

            <p className="text-sm text-[#4A5568] dark:text-[#747474] mt-2">
              {selectedCertificate.issuer && <>Issued by: <span className="font-medium">{selectedCertificate.issuer}</span></>}
              {selectedCertificate.issuedOn && <span className="block">Issued: {selectedCertificate.issuedOn}</span>}
            </p>

            {selectedCertificate.images?.length > 0 && (
              <div className="mt-6 flex justify-center">
                <img
                  src={selectedCertificate.images[0]}
                  alt={selectedCertificate.title || "Certificate"}
                  className="max-h-[55vh] w-auto object-contain rounded-lg border border-gray-200 dark:border-[#323232]"
                />
              </div>
            )}

            {selectedCertificate.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm mt-6">
                {selectedCertificate.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#FFE400]/20 dark:bg-[#FFE400]/10 text-[#1E1E1E] dark:text-[#FFE400] px-2 py-1 rounded-md border border-[#FFE400]/30 dark:border-[#FFE400]/20 transition-colors duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {selectedCertificate.link && (
              <div className="mt-6">
                <a
                  href={selectedCertificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] dark:text-[#FF652F] hover:text-[#2563EB]/80 dark:hover:text-[#FF652F]/80 underline text-sm font-medium transition-colors duration-300 hover:underline-offset-2"
                >
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
