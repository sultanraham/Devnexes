import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const siteStats = {
    stat_1_value: '150K', stat_1_label: 'AI Solutions',
    stat_2_value: '500K', stat_2_label: 'Vision AI',
    stat_3_value: '250M', stat_3_label: 'Web Dev',
    stat_4_value: '200K', stat_4_label: 'Custom'
  }

  const stats = [
    { value: siteStats.stat_1_value, label: siteStats.stat_1_label, color: 'text-[#7c1d1d]' },
    { value: siteStats.stat_2_value, label: siteStats.stat_2_label, color: 'text-[#0f172a]' },
    { value: siteStats.stat_3_value, label: siteStats.stat_3_label, color: 'text-[#1e3a8a]' },
    { value: siteStats.stat_4_value, label: siteStats.stat_4_label, color: 'text-[#0f172a]' },
  ]

  const checklist = [
    "Advanced AI tools for development.",
    "Data-driven real-world solutions.",
    "Expert collaborative technical team."
  ]

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative z-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row overflow-hidden rounded-2xl md:rounded-[24px] shadow-2xl mb-12 md:mb-16 bg-white"
        >
          
          {/* Left Side: Video Thumbnail */}
          <div className="w-full lg:w-1/2 relative min-h-[300px] md:min-h-[500px] group overflow-hidden bg-black">
            {!isPlaying ? (
              <>
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src="/images/devnexes-video-thumbnail.png" 
                  alt="Devnexes Digital Solutions video presentation thumbnail" 
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-700"
                  onClick={() => setIsPlaying(true)}
                />
                
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white rounded-full"
                    />
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 border-t-8 md:border-t-10 border-t-transparent border-l-12 md:border-l-16 border-l-[#0f172a] border-b-8 md:border-b-10 border-b-transparent ml-2" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/aircAruvnKk?autoplay=1&mute=0" 
                title="Devnexes AI Presentation" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              />
            )}
          </div>

          {/* Right Side: Gold Content Box */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 bg-[#1e3a8a] p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white"
          >
             <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-tight mb-6 font-outfit">
                  Understand how it works and start using our services easily
                </h2>
                <p className="text-white/95 text-sm md:text-base mb-8 font-outfit leading-relaxed max-w-lg">
                  We are committed to delivering intelligent AI solutions tailored to your needs.
                </p>
                <ul className="space-y-4 md:space-y-5">
                  {checklist.map((item, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3 + (index * 0.05) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-white shrink-0 flex items-center justify-center mt-1 shadow-sm">
                        <svg className="w-2.5 h-2.5 text-[#1e3a8a] fill-current" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-[15px] font-medium font-outfit leading-snug">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
             </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid Removed */}

      </div>
    </section>
  )
}

export default VideoSection
