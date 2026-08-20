import React from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

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

    let actualValue = numericPart
    if (suffix.toLowerCase() === 'k') actualValue *= 1000
    else if (suffix.toLowerCase() === 'm') actualValue *= 1000000

    let start = 0
    const duration = 2000
    const startTime = performance.now()

    const update = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
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
        // Ensure final state exactly matches the database value
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(update)
  }, [value, isInView])

  return <span ref={ref}>{displayValue}</span>
}

const Hero = ({ t }) => {
  const shouldReduceMotion = useReducedMotion()
  const [socialData, setSocialData] = React.useState({
    transaction_volume: '9.9M',
    split_values: '3.5%',
    reviewed_by: '100k+'
  })

  React.useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const { data, error } = await supabase.from('social_data').select('*').eq('id', 1).single()
        if (data) {
          setSocialData(data)
        }
      } catch (err) {
        console.log('Using default social data')
      }
    }
    fetchSocialData()
    
    const channel = supabase.channel('social_data_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_data', filter: 'id=eq.1' }, (payload) => {
        setSocialData(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
      <div className="relative z-30 container mx-auto px-6 flex flex-col grow items-center text-center pt-48 md:pt-60 pb-20">

        {/* Floating Top Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-500/15 backdrop-blur-xl border border-blue-400/30 text-blue-300 px-5 py-2 rounded-full text-xs md:text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] tracking-widest uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Next-Gen AI &amp; Full-Stack Web Agency</span>
        </motion.div>

        {/* Title with Gradient Text */}
        <motion.h1 
          className="font-outfit text-4xl md:text-7xl lg:text-[96px] font-black text-white mb-8 tracking-tight leading-tight max-w-7xl"
        >
          {t.title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, filter: shouldReduceMotion ? 'none' : 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ 
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: i * 0.06,
              }}
              className={`inline-block mr-[0.22em] ${
                i % 3 === 1 ? 'bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm' : ''
              }`}
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
          className="text-white/80 text-center max-w-3xl mx-auto text-base md:text-xl font-normal leading-relaxed mt-2 mb-10"
        >
          {t.footerDesc}
        </motion.p>

        {/* Trust Badges Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-12"
        >
          {[
            '⚡ Fast Delivery',
            '🛡️ 1-Week Post-Launch Guarantee',
            '🤖 Custom AI Agents',
            '🔒 100% Secure Code'
          ].map((badge, idx) => (
            <span key={idx} className="bg-white/8 backdrop-blur-md border border-white/12 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full max-w-md mx-auto"
        >
          <a href="#login-section" className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(59,130,246,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg shadow-xl shadow-blue-600/30 relative overflow-hidden group/btn flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:animate-shine-fast" />
              <span className="relative z-10">{t.getStarted || 'Get Started'}</span>
            </motion.button>
          </a>
          
          <Link to="/portfolio" className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.18)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/25 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>View Our Work</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Bottom Section: Social Proof & Stats */}
        <div className="w-full mt-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-12 mb-16 text-left">

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl w-full"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <div className="flex -space-x-4 shrink-0 mb-3 sm:mb-0">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                      className="w-12 h-12 rounded-full border-2 border-blue-400/40 bg-gray-800 overflow-hidden shadow-lg relative" 
                      style={{ zIndex: 4 - i }}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="client avatar" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col text-center sm:text-left">
                  <p className="text-blue-400 font-black text-2xl md:text-3xl font-outfit leading-none mb-1">{socialData.reviewed_by}</p>
                  <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                    "{socialData.social_proof}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-auto text-center lg:text-right"
            >
              <div className="flex flex-col items-center lg:items-end bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
                <p className="text-blue-300/80 text-xs font-bold uppercase tracking-widest mb-3">{t.splitValues}</p>
                <div className="flex flex-col items-center lg:items-end mb-4">
                  <h2 className="font-outfit text-blue-400 text-5xl md:text-7xl font-black leading-none tracking-tight">
                    <StatCounter value={statsData[0].value} />
                  </h2>
                  <p className="text-white/70 font-medium text-xs md:text-sm mt-1">
                    {statsData[0].label}
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <h2 className="font-outfit text-indigo-300 text-4xl md:text-5xl font-black leading-none tracking-tight">
                    <StatCounter value={statsData[0].subValue} />
                  </h2>
                  <p className="text-white/70 font-medium text-xs md:text-sm mt-1">
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
