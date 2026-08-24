import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Hero = ({ t }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col justify-center items-center bg-[#061632] overflow-hidden">

      {/* Background Layers */}
      <img
        src="/images/devnexes-digital-solutions-hero-background.png"
        alt="Devnexes Digital Solutions creative hero background design"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
      />

      {/* Cloud Overlay (Top) */}
      <motion.img
        src="/images/devnexes-digital-solutions-hero-clouds.png"
        alt="Devnexes Digital Solutions decorative hero clouds layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 2 }}
        className="absolute -top-10 left-0 w-full h-[60%] object-cover object-top mix-blend-screen z-10 pointer-events-none"
      />

      {/* Blocks Grid Overlay (Bottom) */}
      <motion.img
        src="/images/devnexes-digital-solutions-hero-boxes.png"
        alt="Devnexes Digital Solutions decorative hero boxes grid pattern"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-20 left-0 w-full h-[70%] object-cover object-bottom z-20 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 15%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%)'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-30 container mx-auto px-6 flex flex-col items-center text-center pt-48 md:pt-60 pb-28 md:pb-36 my-auto">

        <motion.h1 
          className="font-outfit text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] max-w-5xl"
        >
          {t.title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.9, rotateX: shouldReduceMotion ? 0 : 30, filter: shouldReduceMotion ? 'none' : 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1.2,
                delay: i * 0.06,
                filter: { duration: 0.5 },
                opacity: { duration: 0.5 }
              }}
              className="inline-block mr-[0.2em] origin-bottom"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/80 font-medium text-base md:text-lg max-w-2xl mb-10 leading-relaxed"
        >
          {t.socialProof}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link to="/contact" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.25)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto min-w-[160px] bg-white/10 backdrop-blur-lg border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden group/btn cursor-pointer"
            >
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine-fast"
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">{t.getStarted}</span>
            </motion.button>
          </Link>

          <Link to="/contact" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.25)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto min-w-[160px] bg-white/10 backdrop-blur-lg border border-white/30 text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden group/btn cursor-pointer"
            >
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine-fast"
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">{t.register}</span>
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

export default Hero
