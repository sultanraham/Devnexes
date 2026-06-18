import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Cpu, Code2, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'

const DigitalGrowth = ({ t }) => {
  if (!t) return null;
  const shouldReduceMotion = useReducedMotion()
  const cards = [
    {
      icon: <Cpu className="text-[#1a365d] w-7 h-7" />,
      iconBg: "bg-red-50",
      title: "Ai services",
      description: "Gain high-performance AI insights with zero operational overhead.",
      bullets: ["Automation", "Computer vision", "Smart Detection"],
      buttonText: "Contact"
    },
    {
      icon: <Code2 className="text-yellow-600 w-7 h-7" />,
      iconBg: "bg-yellow-50",
      title: "Custom web and app development",
      description: "Dev access upgraded with advanced tools.",
      bullets: ["Responsive (Android & iOS)", "All Frameworks", "within 1 week"],
      buttonText: "Contact"
    },
    {
      icon: <Briefcase className="text-blue-900 w-7 h-7" />,
      iconBg: "bg-blue-50",
      title: "B2B solutions services",
      description: "Request custom solutions for every need.",
      bullets: ["Custom Request", "Feel free for contact us", "smart scaling"],
      buttonText: "Apply Now"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url("/digital_growth.png")' }}
      />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-20 text-center lg:text-left"
        >
          <h2 className="text-[#1e3a8a] text-3xl md:text-5xl font-bold mb-6 font-outfit leading-tight">{t.title}</h2>
          <p className="text-[#899bbd] text-base md:text-xl max-w-4xl mx-auto lg:mx-0 leading-relaxed font-outfit font-medium">
            {t.desc}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ 
                opacity: 0, 
                x: shouldReduceMotion ? 0 : (index === 0 ? -100 : index === 2 ? 100 : 0),
                y: shouldReduceMotion ? 0 : (index === 1 ? 100 : 0),
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ 
                type: "spring", 
                stiffness: 180, 
                damping: 20, 
                delay: index * 0.05,
                filter: { type: "tween", duration: 0.6, ease: "easeOut" }
              }}
              className="relative group bg-[#f3f4f6] p-6 md:p-8 rounded-2xl md:rounded-[28px] flex flex-col h-full transition-all duration-300 hover:bg-[#eff6ff] hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="relative z-10">
                <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm`}>
                  {card.icon}
                </div>

                <h3 className="text-black text-xl md:text-2xl font-bold mb-3 font-outfit">{card.title}</h3>
                <p className="text-gray-700 text-sm md:text-base mb-6 font-outfit leading-snug">
                  {card.description}
                </p>

                <ul className="flex flex-col gap-3 mb-8">
                  {card.bullets.map((bullet, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                      className="flex items-center gap-2.5 text-gray-600 font-outfit font-medium text-[14px]"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {bullet}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <Link 
                  to='/contact'
                  className="w-full bg-[#d5d5d5] hover:bg-black hover:text-white text-black py-3 rounded-xl font-bold text-lg font-outfit transition-all flex items-center justify-center"
                >
                  {card.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default DigitalGrowth
