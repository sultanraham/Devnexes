import React from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
const StatCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = React.useState("0")
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  React.useEffect(() => {
    if (!isInView || !value) {
      setDisplayValue("0")
      return
    }

    const numericPart = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
    const suffix = value.replace(/[0-9.]/g, '')

    let actualValue = numericPart
    if (suffix.toLowerCase() === 'k') actualValue *= 1000
    else if (suffix.toLowerCase() === 'm') actualValue *= 1000000

    let start = 0
    const duration = 2000
    const startTime = performance.now()

    const update = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      if (progress < 1) {
        if (suffix.toLowerCase() === 'k' || suffix.toLowerCase() === 'm') {
          const raw = start + (actualValue - start) * easedProgress
          let formatted = Math.floor(raw).toString()
          if (raw >= 1000000) {
            formatted = (raw / 1000000).toFixed(1) + suffix
          } else if (raw >= 1000) {
            formatted = (raw / 1000).toFixed(1) + suffix
          }
          setDisplayValue(formatted)
        } else {
          const current = start + (numericPart - start) * easedProgress
          const formatted = value.includes('.') ? current.toFixed(1) : Math.floor(current).toString()
          setDisplayValue(formatted + suffix)
        }
        requestAnimationFrame(update)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(update)
  }, [value, isInView])

  return <span ref={ref}>{displayValue}</span>
}

const Hero = ({ t }) => {
  const shouldReduceMotion = useReducedMotion()
  const socialData = {
    transaction_volume: '9.9M',
    split_values: '3.5%',
    reviewed_by: '100k+'
  }

  const statsData = [
    { value: socialData.transaction_volume, label: t.transactionVolume, subValue: socialData.split_values, subLabel: t.splitValues },
  ]

  return (
    <section className="relative min-h-screen w-full flex flex-col bg-[#061632] overflow-hidden">

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
      <div className="relative z-30 container mx-auto px-6 flex flex-col grow items-center text-center pt-36 md:pt-48 pb-20">

        <motion.h1 
          className="font-outfit text-4xl md:text-7xl lg:text-[105px] font-bold text-white mb-10 tracking-tight leading-[1.05] max-w-7xl"
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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/80 font-medium text-lg md:text-2xl max-w-3xl mb-14 leading-relaxed"
        >
          {t.socialProof}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full sm:w-auto"
        >
          <Link to="/contact" className="w-full sm:w-auto">
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
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
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
          </Link>
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
                <div className="flex -space-x-4 shrink-0 mb-4 sm:mb-0">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/40 bg-gray-800 overflow-hidden shadow-2xl relative" 
                      style={{ zIndex: 4 - i }}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="client avatar" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col text-center sm:text-left">
                  <p className="text-white font-black text-2xl md:text-3xl font-outfit leading-none mb-2 tracking-tight drop-shadow-md">{socialData.reviewed_by}</p>
                  <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                    "{socialData.social_proof}"
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
              className="w-full lg:w-auto text-center lg:text-right lg:pr-12"
            >
              <div className="flex flex-col items-center lg:items-end">
                <p className="text-blue-300 font-bold text-xs md:text-sm mb-3 uppercase tracking-widest">{t.splitValues}</p>
                <div className="flex flex-col items-center lg:items-end mb-8">
                  <h2 className="font-outfit text-white text-6xl md:text-8xl lg:text-[96px] font-black leading-none tracking-tighter drop-shadow-lg">
                    <StatCounter value={statsData[0].value} />
                  </h2>
                  <p className="text-white/90 font-bold mt-2 text-base md:text-lg">
                    {statsData[0].label}
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <h2 className="font-outfit text-white text-6xl md:text-8xl lg:text-[96px] font-black leading-none tracking-tighter drop-shadow-lg">
                    <StatCounter value={statsData[0].subValue} />
                  </h2>
                  <p className="text-white/90 font-bold mt-2 text-base md:text-lg">
                    {statsData[0].subLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
