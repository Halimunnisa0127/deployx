import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does DeployX work?",
      answer: "DeployX connects directly to your GitHub account using secure OAuth permissions. When you push new code to your connected repository branch, DeployX automatically triggers a build worker, compiles your assets, and deploys the resulting static or server artifacts to our global edge network."
    },
    {
      question: "Do I need Docker installed?",
      answer: "No, you do not need Docker installed locally or on a server. DeployX manages all build environments, runtime containerization, and server dependencies automatically behind the scenes."
    },
    {
      question: "Can I deploy private repositories?",
      answer: "Yes! DeployX supports both public and private GitHub repositories. During OAuth authorization, you can grant read access to your private repos while keeping your codebase completely secure."
    },
    {
      question: "Which frameworks are supported?",
      answer: "DeployX natively supports modern web frameworks including React, Next.js, Vite, Vue, Angular, Svelte, HTML/CSS/JS static sites, and Node.js backend services. Custom build commands can be configured easily in your project settings."
    },
    {
      question: "Can I connect custom domains?",
      answer: "Yes, custom domain mapping is supported. Simply add your custom domain in the project dashboard and configure the provided DNS CNAME record. DeployX automatically issues and renews free SSL certificates via Let's Encrypt."
    },
    {
      question: "Is DeployX self-hosted?",
      answer: "DeployX is available as a cloud platform or as a self-hostable deployment engine depending on your infrastructure requirements. You can run the entire DeployX control plane on your own server infrastructure if desired."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 lg:py-36 bg-[#08090c] border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about DeployX and automated deployments.
          </p>
        </motion.div>

        {/* Accordion List with Refined Width & Item Spacing */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          className="space-y-5 text-left"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? "bg-white/[0.04] border-blue-500/40 shadow-[0_0_25px_rgba(37,99,235,0.15)]" 
                    : "bg-white/[0.015] border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
