import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircleQuestion } from 'lucide-react'

const FAQSection = ({ t }) => {
  if (!t) return null;
  const [activeIndex, setActiveIndex] = useState(null)

  const faqs = [
    {
      title: "What services does Devnexes Digital Solutions provide?",
      description: "We specialize in Custom Web Development, AI Automation, SEO optimization, UI/UX Design, and intelligent Chatbot integrations tailored to your business needs."
    },
    {
      title: "How long does it typically take to build a custom website?",
      description: "The timeline depends on the project's complexity. A standard corporate website usually takes 2 to 4 weeks, while complex web applications or AI-integrated platforms may take a few months."
    },
    {
      title: "Do you provide ongoing support and maintenance after launch?",
      description: "Yes! We offer continuous support, maintenance, and regular updates to ensure your website and AI systems remain secure, fast, and up-to-date."
    },
    {
      title: "Can you integrate AI features into my existing website?",
      description: "Absolutely. We can integrate smart AI solutions like intelligent chatbots, automated customer support, and predictive analytics into your current digital infrastructure."
    },
    {
      title: "How does the payment process work for projects?",
      description: "We typically work with a milestone-based payment structure. An initial deposit is required to kick off the project, followed by payments upon completion of key development phases."
    },
    {
      title: "How can I track the progress of my ongoing project?",
      description: "You can easily track your project's status by logging into your Devnexes account and visiting the 'My Status' dashboard, where we post regular updates and milestones."
    }
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="faq-section" className="py-20 md:py-32 bg-[#fafbfc] overflow-hidden font-outfit relative">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header Area */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-sm border border-blue-100"
          >
            <MessageCircleQuestion size={32} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#1a2b49] mb-6 tracking-tight leading-tight"
          >
            {t.title || 'Frequently Asked Questions'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {t.desc || 'We have gathered the most common questions to help you get started quickly and seamlessly.'}
          </motion.p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={index} 
                className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isActive 
                    ? 'bg-white border-blue-200 shadow-[0_10px_40px_rgba(59,130,246,0.08)]' 
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-blue-100 hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className={`text-lg md:text-xl font-bold pr-8 transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1a2b49] group-hover:text-blue-600'}`}>
                    {faq.title}
                  </h3>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed border-t border-slate-50 mt-2 pt-4">
                        {faq.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Still have questions banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
        >
          {/* Decorative graphic inside banner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Business?</h4>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto font-medium">
              Have a unique project in mind or need expert advice? Let's discuss how our custom Web and AI solutions can drive your digital growth.
            </p>
            <a 
              href="mailto:support@devnexes.com"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
            >
              Discuss Your Project
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default FAQSection
