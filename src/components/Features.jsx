import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, ShoppingBag, Network, Headphones, Shield, Zap, Cpu, Settings, Globe, Database } from 'lucide-react'

const Features = () => {
  const [activeTab, setActiveTab] = useState('Work')

  const tabs = ['Work', 'Tools', 'Automation']

  const tabData = {
    Work: [
      { icon: <Landmark />, title: "Space", description: "Manage your daily operations and projects with flexible, secure AI-powered workspaces." },
      { icon: <ShoppingBag />, title: "AI Solutions", description: "Power your business with intelligent, scalable AI systems designed to automate tasks." },
      { icon: <Network />, title: "Growth Solutions", description: "Scale your business with intelligent AI systems designed to drive long-term growth." },
      { icon: <Headphones />, title: "Support", description: "24/7 Help Center Round-the-clock assistance powered by intelligent systems." }
    ],
    Tools: [
      { icon: <Shield />, title: "Advanced Security", description: "Protect your data with enterprise-grade encryption and threat monitoring." },
      { icon: <Zap />, title: "Performance", description: "Optimize your workflows with high-speed processing tools and data analytics." },
      { icon: <Cpu />, title: "Compute Power", description: "Access scalable cloud computing resources that grow with your requirements." },
      { icon: <Settings />, title: "Customization", description: "Tailor our tools to your specific needs with modular configurations." }
    ],
    Automation: [
      { icon: <Globe />, title: "Global Reach", description: "Automate your global operations with multi-region deployment." },
      { icon: <Database />, title: "Smart Data", description: "Automate data entry and processing with intelligent OCR." },
      { icon: <Cpu />, title: "Robotic Flow", description: "Streamline repetitive tasks with smart robotic process automation." },
      { icon: <Network />, title: "Connected Hub", description: "Integrate all your automated systems into a single, cohesive dashboard." }
    ]
  }

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-20 text-center lg:text-left"
        >
          <p className="text-blue-600 font-bold text-sm md:text-lg mb-2 font-outfit uppercase tracking-wide">Why Choose Us</p>
          <h2 className="text-[#1e3a8a] text-3xl md:text-[46px] font-bold mb-6 leading-tight font-outfit">
            Intelligent Innovation for Everyday Experiences
          </h2>
          <p className="text-[#899bbd] text-base md:text-xl max-w-3xl mx-auto lg:mx-0 leading-relaxed font-outfit font-medium opacity-90">
            Combining trusted security with cutting-edge AI technology.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* Tabs - Horizontal on Mobile, Vertical on Desktop */}
          <div className="w-full lg:w-[220px] overflow-x-auto no-scrollbar pb-4 md:pb-0">
            <div className="bg-[#f8f9fb] p-3 md:p-5 rounded-2xl md:rounded-[32px] flex flex-row lg:flex-col gap-3 min-w-max md:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 md:py-3.5 px-6 rounded-full text-base md:text-lg font-bold transition-all font-outfit whitespace-nowrap ${activeTab === tab
                      ? 'bg-[#1e3a8a] text-white shadow-xl'
                      : 'text-[#899bbd] hover:bg-gray-100/50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grow w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {tabData[activeTab].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 150, 
                      damping: 18, 
                      delay: index * 0.05
                    }}
                    whileHover={{ 
                      y: -10,
                      rotateX: 5,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    className="relative bg-[#f8f9fb] p-8 md:p-10 rounded-2xl md:rounded-[32px] overflow-hidden transition-all duration-300 group cursor-pointer perspective-[1000px]"
                  >
                    <div className="absolute inset-0 bg-[#0f2b6a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    <div className="relative z-10 flex flex-col items-start h-full">
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: (index * 0.05) + 0.1, type: "spring" }}
                        className="mb-6 h-12 w-12 md:h-16 md:w-16 flex items-center justify-center text-[#0f2b6a] group-hover:text-white transition-all duration-700 transform group-hover:translate-x-4 lg:group-hover:translate-x-48"
                      >
                        {React.cloneElement(feature.icon, { className: "w-8 h-8 md:w-10 md:h-10" })}
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.05) + 0.2 }}
                        className="group-hover:translate-x-2 transition-transform duration-500"
                      >
                        <h3 className="text-[#0f2b6a] text-xl md:text-2xl font-bold mb-3 md:mb-4 font-outfit group-hover:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-[#5b739d] text-sm md:text-[17px] leading-relaxed font-outfit group-hover:text-white/80">
                          {feature.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features
