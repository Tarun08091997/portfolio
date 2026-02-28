import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Create mailto link (you can replace this with a backend API call)
    const mailtoLink = `mailto:tarunsharma080997@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Simulate form submission
    setTimeout(() => {
      window.location.href = mailtoLink;
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 500);
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

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Contact Form */}
        <motion.div
          className="p-6 md:p-8 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
            Send me a message
          </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4A5568] dark:text-[#747474] mb-2 transition-colors duration-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2E2E2E] text-[#1E1E1E] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#FF652F] focus:border-transparent transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4A5568] dark:text-[#747474] mb-2 transition-colors duration-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2E2E2E] text-[#1E1E1E] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#FF652F] focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#4A5568] dark:text-[#747474] mb-2 transition-colors duration-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2E2E2E] text-[#1E1E1E] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#FF652F] focus:border-transparent transition-all duration-300"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#4A5568] dark:text-[#747474] mb-2 transition-colors duration-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3A3A3A] bg-white dark:bg-[#2E2E2E] text-[#1E1E1E] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#FF652F] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] dark:bg-[#FF652F] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1d4ed8] dark:hover:bg-[#e55a1f] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-400 text-sm"
                >
                  Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>

        {/* Contact Info & Social Links */}
        <div className="space-y-6">
          {/* Contact Information */}
          <motion.div
            className="p-6 md:p-8 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-[#2E2E2E] border border-gray-200 dark:border-[#3A3A3A] hover:border-[#2563EB]/50 dark:hover:border-[#FF652F]/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                >
                  <div className="p-3 rounded-lg bg-[#2563EB]/10 dark:bg-[#FF652F]/20 text-[#2563EB] dark:text-[#FF652F] group-hover:scale-110 transition-transform duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-[#4A5568] dark:text-[#747474] transition-colors duration-300">
                      {info.label}
                    </p>
                    <p className="text-base font-semibold text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
            </motion.div>

          {/* Social Links */}
          <motion.div
            className="p-6 md:p-8 rounded-xl bg-[#FAFBFF] dark:bg-[#323232] border border-gray-200 dark:border-[#3A3A3A]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#1E1E1E] dark:text-[#F5F5F5] transition-colors duration-300">
              Connect with me
            </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 p-4 rounded-lg ${social.bgColor} ${social.iconColor} ${social.color} transition-all duration-300 flex flex-col items-center justify-center gap-2 group`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                    <span className="text-sm font-medium">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
    </motion.section>
  );
};

export default Contact;

