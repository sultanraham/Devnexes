import React from 'react'
import { motion } from 'framer-motion'

const FAQSection = ({ t }) => {
  if (!t) return null;
  const faqs = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Log in to your account using your existing credentials.",
      description: "Log in to your account, go to Profile > Edit Profile, and update your email under the General section. Save your changes to confirm."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "How can I contact?",
      description: "Visit Contact Us and reach out to our support team via email. You will receive a response within 24 hours on business days."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "How can I edit my ongoing project and add new functionality during development?",
      description: "Log in using your credentials, then go to the Edit Recent / Current Project section where your ongoing work is listed. From there, you can make changes or add new functionality to your project. After updating, save and test the changes before finalizing."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "How can I check the status of my Project?",
      description: "Log in with your credentials, then go to My Status to view the details."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      ),
      title: "How payment method done?",
      description: "Payments are completed by selecting a method, entering your details, and confirming the transaction securely."
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "How much time will it take to complete a project?",
      description: "Based on your request, the estimated completion time is around 1 week."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-white overflow-hidden relative">
      {/* Background Image removed to fix 404 */}

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10"
      >
        {/* Main Card Wrapper */}
        <div className="bg-[#f8f9fb] rounded-[32px] p-8 md:p-16 shadow-sm border border-gray-100">
          
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[#1a365d] text-4xl md:text-[52px] font-bold font-outfit mb-4"
            >
              {t.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#899bbd] text-base md:text-xl max-w-2xl mx-auto font-outfit"
            >
              {t.desc}
            </motion.p>
          </div>

          {/* 3x2 Matrix Grid inside the card */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12"
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50, filter: 'blur(5px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4 } }
                }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left group"
              >
                <motion.div 
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5
                  }}
                  className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#5e72e4] group-hover:text-white transition-all duration-300 shadow-sm cursor-pointer border border-gray-100"
                >
                  {faq.icon}
                </motion.div>
                
                <h3 className="text-[#1a365d] text-lg font-bold mb-3 font-outfit leading-tight group-hover:text-[#5e72e4] transition-colors">
                  {faq.title}
                </h3>
                
                <p className="text-[#899bbd] text-sm leading-relaxed font-outfit opacity-90">
                  {faq.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Still have questions banner */}
        <div className="flex justify-center mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-gray-100 shadow-sm w-full max-w-4xl"
          >
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h5 className="text-[#1a365d] text-xl font-bold mb-1 font-outfit">Still have questions?</h5>
              <p className="text-[#899bbd] text-sm font-outfit">We're here to help you 24/7.</p>
            </div>
            <a 
              href="mailto:support@devnexes.com"
              className="bg-[#5e72e4] text-white px-8 py-3 rounded-full font-bold hover:bg-[#485ec4] transition-all shadow-lg shadow-[#5e72e4]/20"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default FAQSection
