import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaMapMarkerAlt, FaDownload, FaCopy, FaCheck } from "react-icons/fa";

const Contact = () => {
  const [copiedItems, setCopiedItems] = useState({});

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems({ ...copiedItems, [key]: true });
      setTimeout(() => {
        setCopiedItems({ ...copiedItems, [key]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const socialLinks = [
    {
      icon: <FaLinkedin className="text-2xl" />,
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/tarun-kumar-988887159/",
      color: "hover:bg-blue-600 hover:text-white",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <FaGithub className="text-2xl" />,
      label: "GitHub",
      link: "https://github.com/Tarun08091997",
      color: "hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900",
      bgColor: "bg-gray-50 dark:bg-gray-800",
      iconColor: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      label: "Email",
      link: "mailto:tarunsharma080997@gmail.com",
      color: "hover:bg-red-600 hover:text-white",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-xl" />,
      label: "Email",
      value: "tarunsharma080997@gmail.com",
      link: "mailto:tarunsharma080997@gmail.com",
    },
    {
      icon: <FaPhone className="text-xl" />,
      label: "Phone",
      value: "+91 9774587305",
      link: "tel:+919774587305",
    },
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      label: "Location",
      value: "Available for remote work",
      link: "#",
    },
  ];

  return (
    <motion.section
      className="bg-transparent rounded-2xl p-8 md:p-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-3 rounded-lg bg-[#2563EB]/10 dark:bg-[#FF652F]/20">
          <FaEnvelope className="text-2xl text-[#2563EB] dark:text-[#FF652F]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
          Get In Touch
        </h2>
      </motion.div>
      <motion.p
        className="text-base md:text-lg text-[#4A5568] dark:text-[#747474] mb-8 max-w-2xl transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        Feel free to reach out!
      </motion.p>

      <div className="max-w-5xl mx-auto">
        {/* Contact Info & Social Links */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-3 p-6 md:p-8 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-[#2E2E2E] border border-gray-200 dark:border-[#3A3A3A] hover:border-[#2563EB]/50 dark:hover:border-[#FF652F]/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                >
                  <a
                    href={info.link}
                    className="flex items-center gap-4 flex-1"
                  >
                    <div className="p-3 rounded-lg bg-[#2563EB]/10 dark:bg-[#FF652F]/20 text-[#2563EB] dark:text-[#FF652F] group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#4A5568] dark:text-[#747474] transition-colors duration-300">
                        {info.label}
                      </p>
                      <p className="text-base font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
                        {info.value}
                      </p>
                    </div>
                  </a>
                  {(info.label === "Email" || info.label === "Phone") && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(info.value, `contact-${index}`);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A3A3A] transition-colors duration-300 group/copy"
                      title="Copy to clipboard"
                    >
                      {copiedItems[`contact-${index}`] ? (
                        <FaCheck className="text-green-600 dark:text-green-400 text-lg" />
                      ) : (
                        <FaCopy className="text-[#4A5568] dark:text-[#747474] group-hover/copy:text-[#2563EB] dark:group-hover/copy:text-[#FF652F] text-lg transition-colors duration-300" />
                      )}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Download Resume Button */}
            <motion.a
              href="/resume/Tarun Kumar.pdf"
              download="Tarun Kumar Resume.pdf"
              className="mt-6 w-full flex items-center justify-center gap-3 p-4 rounded-lg bg-[#2563EB] dark:bg-[#FF652F] text-white hover:bg-[#1d4ed8] dark:hover:bg-[#e55a1f] transition-all duration-300 shadow-lg hover:shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaDownload className="text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-base">Download Resume</span>
            </motion.a>
            </motion.div>

          {/* Social Links */}
          <motion.div
            className="lg:col-span-2 p-6 md:p-8 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300 text-center">
              Connect with me
            </h3>
              <div className="flex flex-col gap-4 items-center">
                {socialLinks.map((social, index) => {
                  const textToCopy = social.link.startsWith("mailto:") 
                    ? social.link.replace("mailto:", "") 
                    : social.link;
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex flex-col gap-2 w-full items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                    >
                      <motion.a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full p-4 rounded-lg ${social.bgColor} ${social.iconColor} ${social.color} transition-all duration-300 flex flex-row items-center justify-center gap-3 group`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {social.icon}
                        <span className="text-sm font-medium">{social.label}</span>
                      </motion.a>
                      <div
                        onClick={() => handleCopy(textToCopy, `social-${index}`)}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-[#2E2E2E] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] transition-colors duration-300 text-sm text-[#4A5568] dark:text-[#747474] hover:text-[#2563EB] dark:hover:text-[#FF652F] cursor-pointer group/copy w-full"
                      >
                        {copiedItems[`social-${index}`] ? (
                          <>
                            <FaCheck className="text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="group-hover/copy:scale-110 transition-transform duration-300" />
                            <span className="break-all text-center">{textToCopy}</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
      </div>
    </motion.section>
  );
};

export default Contact;

