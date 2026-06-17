import React from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const StatCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = React.useState("0")
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  React.useEffect(() => {
    if (!isInView) {
      setDisplayValue("0")
      return
    }

    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''))
    const suffix = value.replace(/[0-9.]/g, '')

    let start = 0
    const duration = 1500
    const startTime = performance.now()

    const update = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = start + (numericPart - start) * easedProgress

      const formatted = value.includes('.')
        ? current.toFixed(1)
        : Math.floor(current).toString()

      setDisplayValue(formatted + suffix)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }, [value, isInView])

  return <span ref={ref}>{displayValue}</span>
}

const Hero = ({ t }) => {
  const shouldReduceMotion = useReducedMotion()
  const statsData = [
    { value: "9.9M", label: t.transactionVolume, subValue: "3.5%", subLabel: t.splitValues },
  ]

  return (
    <section className="relative min-h-screen w-full flex flex-col bg-[#061632] overflow-hidden">

      {/* Background Layers */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      />

      {/* Cloud Overlay (Top) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 2 }}
        className="absolute -top-10 left-0 w-full h-[60%] mix-blend-screen z-10 pointer-events-none bg-no-repeat bg-cover"
        style={{
          backgroundImage: 'url("/hero-bg-clouds.png")',
          backgroundPosition: 'top center'
        }}
      />

      {/* Blocks Grid Overlay (Bottom) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-20 left-0 w-full h-[70%] z-20 pointer-events-none"
        style={{
          backgroundImage: 'url("/hero-bg-boxes.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%)'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-30 container mx-auto px-6 flex flex-col grow items-center text-center pt-32 md:pt-52 pb-16">

        <motion.h1 
          className="font-outfit text-4xl md:text-7xl lg:text-[105px] font-bold text-white mb-10 tracking-tight leading-none max-w-7xl"
        >
          {t.title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50, scale: shouldReduceMotion ? 1 : 0.85, rotateX: shouldReduceMotion ? 0 : 45, filter: shouldReduceMotion ? 'none' : 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1.2,
                delay: i * 0.08,
                filter: { duration: 0.6 },
                opacity: { duration: 0.6 }
              }}
              className="inline-block mr-[0.2em] origin-bottom"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 md:mt-24 mb-20 w-full"
        >
          <a href="#login-section" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.25)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-lg border border-white/30 text-white px-12 py-3.5 rounded-full font-bold text-xl md:text-[32px] hover:bg-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden group/btn"
            >
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine-fast"
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">{t.getStarted}</span>
            </motion.button>
          </a>
          <a href="#login-section" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.25)",
                boxShadow: "0 0 30px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/30 text-white px-12 py-3.5 rounded-full font-bold text-xl md:text-[32px] hover:bg-white/20 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden group/btn"
            >
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shine-fast"
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">{t.register}</span>
            </motion.button>
          </a>
        </motion.div>

        {/* Bottom Section */}
        <div className="w-full mt-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-16 mb-24 text-left">

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl w-full"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-8 shrink-0 mb-4 sm:mb-0">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#1a365d] bg-gray-800 overflow-hidden shadow-2xl relative" 
                      style={{ zIndex: 4 - i }}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="client avatar" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col text-center sm:text-left">
                  <p className="text-[#163c8a] font-bold text-2xl md:text-[28px] font-outfit leading-none mb-2">{t.reviewedBy}</p>
                  <p className="text-white/80 text-sm md:text-[16px] font-medium leading-relaxed opacity-90">
                    "{t.socialProof}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-auto text-center lg:text-right lg:pr-24"
            >
              <div className="flex flex-col items-center lg:items-end">
                <p className="text-white/60 text-sm mb-4 font-normal uppercase tracking-wider">{t.splitValues}</p>
                <div className="flex flex-col items-center lg:items-end mb-6">
                  <h2 className="font-outfit text-[#163c8a] text-6xl md:text-[84px] font-semibold leading-none tracking-tighter">
                    <StatCounter value={statsData[0].value} />
                  </h2>
                  <p className="text-white/80 font-normal mt-1 text-sm md:text-[16px]">
                    {statsData[0].label}
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <h2 className="font-outfit text-[#163c8a] text-6xl md:text-[84px] font-semibold leading-none tracking-tighter">
                    <StatCounter value={statsData[0].subValue} />
                  </h2>
                  <p className="text-white/80 font-normal mt-1 text-sm md:text-[16px]">
                    {statsData[0].subLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Descriptive Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#5b739d] text-center max-w-4xl mx-auto text-lg md:text-xl font-medium leading-relaxed opacity-80 pb-12"
          >
            {t.footerDesc}
          </motion.p>
        </div>

      </div>
    </section>
  )
}

export default Hero
