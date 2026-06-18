import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion'
import { supabase } from '../supabaseClient'

const Counter = ({ value }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const num = parseInt(value) || 0
  const suffix = value.replace(/[0-9]/g, '')
  const spring = useSpring(0, { stiffness: 40, damping: 20 })
  const display = useTransform(spring, current => Math.floor(current))
  useEffect(() => { if (isInView) spring.set(num) }, [isInView, num, spring])
  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </span>
  )
}

const AvatarOrbit = ({ client, radius, isAnyHovered, hoveredId, onHover, isReverse, isMobile }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`
  const isMeHovered = hoveredId === client.id

  const rad = (client.angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  return (
    <div
      className={`absolute flex items-center justify-center pointer-events-auto ${isMeHovered ? 'z-100' : 'z-30'}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={`relative flex items-center justify-center ${isAnyHovered ? 'paused' : ''} ${isReverse ? 'orbit-counter-rotate-reverse-avatar' : 'orbit-counter-rotate-avatar'}`}>
        <div
          onMouseEnter={() => onHover(client)}
          onMouseLeave={() => onHover(null)}
          className="relative flex items-center justify-center cursor-pointer"
        >
          <AnimatePresence>
            {isMeHovered && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0.25 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute w-12 h-12 md:w-16 md:h-16 bg-blue-400 rounded-full blur-xl z-0"
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={isMeHovered ? { scale: 1.15 } : { scale: 1 }}
            className={`w-9 h-9 md:w-14 md:h-14 rounded-full border-2 ${isMeHovered ? 'border-blue-500' : 'border-white'} bg-white overflow-hidden shadow-xl relative z-10`}
          >
            <img src={avatarUrl} alt={client.name} loading="lazy" decoding="async" width="56" height="56" className="w-full h-full object-cover" />
          </motion.div>

          {/* DESKTOP TOOLTIP - ALWAYS ON THE RIGHT */}
          {!isMobile && (
            <AnimatePresence>
              {isMeHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 60, y: -60 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
                  className="absolute left-full top-0 z-9999 w-[320px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 pointer-events-none origin-bottom-left ml-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-0.5 font-outfit">{client.name}</h4>
                      <p className="text-gray-400 text-xs font-outfit uppercase tracking-widest font-semibold">{client.role}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden shrink-0">
                      <img src={avatarUrl} alt={client.name} loading="lazy" decoding="async" width="48" height="48" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-[15px] leading-relaxed font-outfit italic">"{client.text}"</p>
                  {/* Small arrow pointing back to avatar */}
                  <div className="absolute top-[55px] -left-2 w-4 h-4 bg-white rotate-45 border-l border-b border-gray-100" />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

const TrustedClients = ({ t }) => {
  const [hoveredAvatar, setHoveredAvatar] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [clientCount, setClientCount] = useState('1000+k')
  const [clients, setClients] = useState([
    { id: 1, name: 'Sara', role: 'Digital Creator', ring: 'outer', angle: 0, text: 'Quick and easy account opening.' },
    { id: 2, name: 'Jack', role: 'Software Engineer', ring: 'outer', angle: 90, text: 'Best automation tools available.' },
    { id: 3, name: 'Oliver', role: 'Business Owner', ring: 'outer', angle: 180, text: 'Expert technical guidance.' },
    { id: 4, name: 'Emma', role: 'Marketing Lead', ring: 'outer', angle: 270, text: 'Secure digital platforms.' },
    { id: 5, name: 'Sophie', role: 'UX Designer', ring: 'middle', angle: 45, text: 'A game changer for workflow.' },
    { id: 6, name: 'Charlie', role: 'Product Manager', ring: 'middle', angle: 135, text: 'Real insights within a week.' },
    { id: 7, name: 'Aneka', role: 'Entrepreneur', ring: 'middle', angle: 225, text: 'Best investment for startups.' },
  ])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase.from('trusted_clients').select('*').order('ring').order('angle')
        if (data && data.length > 0) {
          setClients(data)
        }
      } catch (err) {
        console.log('Using default clients')
      }
    }
    fetchClients()
    
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'trusted_clients_count').single()
        if (data && data.value) setClientCount(data.value)
      } catch (err) {}
    }
    fetchSettings()

    const channel = supabase.channel('trusted_clients_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trusted_clients' }, () => {
        fetchClients()
      })
      .subscribe()

    const channelSettings = supabase.channel('trusted_clients_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings', filter: "key=eq.trusted_clients_count" }, (payload) => {
        if (payload.new && payload.new.value) setClientCount(payload.new.value)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(channelSettings)
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const outerRadius = isMobile ? 145 : 200
  const middleRadius = isMobile ? 100 : 140
  const diagramSize = isMobile ? 320 : 450

  if (!t) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-visible relative z-20">
      <style>{`
        @keyframes orbit-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-rotate-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes orbit-counter-rotate { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes orbit-counter-rotate-reverse { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orbit-container { animation: orbit-rotate 40s linear infinite; }
        .orbit-container-reverse { animation: orbit-rotate-reverse 50s linear infinite; }
        .orbit-counter-rotate-avatar { animation: orbit-counter-rotate 40s linear infinite; }
        .orbit-counter-rotate-reverse-avatar { animation: orbit-counter-rotate-reverse 50s linear infinite; }
        .paused { animation-play-state: paused !important; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-container, .orbit-container-reverse,
          .orbit-counter-rotate-avatar, .orbit-counter-rotate-reverse-avatar { animation: none; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row items-center justify-start gap-0 relative z-10"
      >

        {/* MOBILE DETAIL CARD */}
        <AnimatePresence>
          {isMobile && hoveredAvatar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-8 lg:hidden"
            >
              <div className="bg-[#f8f9fb] rounded-2xl p-6 border border-blue-100 shadow-lg mx-auto max-w-[340px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-500 bg-white overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hoveredAvatar.name}`} alt={hoveredAvatar.name} loading="lazy" decoding="async" width="48" height="48" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#163c8a] font-outfit">{hoveredAvatar.name}</h4>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest">{hoveredAvatar.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-[14px] italic font-outfit">"{hoveredAvatar.text}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full lg:w-[45%] flex items-center justify-center lg:justify-start h-[320px] md:h-[550px] shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center transition-all duration-500"
            style={{ width: diagramSize, height: diagramSize }}
          >
            {/* CENTRAL CIRCLE - MOVED TO BACK LAYER (z-0) */}
            <div
              className="absolute bg-gradient-to-br from-[#4a6bb1] to-[#1e4b8b] rounded-full shadow-2xl border border-blue-300/30 z-0 flex items-center justify-center overflow-hidden"
              style={{ width: isMobile ? 100 : 180, height: isMobile ? 100 : 180 }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 w-full h-full bg-white/20 rounded-full blur-xl" />
              <img src="/favicon.png" alt="Devnexes Logo" className="relative z-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ width: isMobile ? '55px' : '95px', height: isMobile ? '55px' : '95px' }} />
            </div>

            <div className="absolute inset-0 pointer-events-none z-10">
              <svg width={diagramSize} height={diagramSize} viewBox={`0 0 ${diagramSize} ${diagramSize}`}>
                <circle cx={diagramSize / 2} cy={diagramSize / 2} r={outerRadius} fill="none" stroke="#8b2b2b" strokeWidth="2" strokeDasharray="10 15" className="opacity-30" />
                <circle cx={diagramSize / 2} cy={diagramSize / 2} r={middleRadius} fill="none" stroke="#8b2b2b" strokeWidth="1.5" strokeDasharray="8 12" className="opacity-20" />
              </svg>
            </div>

            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none orbit-container z-20 ${hoveredAvatar ? 'paused' : ''}`}>
              {clients.filter(c => c.ring === 'outer').map((client, i, arr) => {
                const dynamicAngle = (360 / arr.length) * i;
                return (
                  <AvatarOrbit key={client.id} client={{...client, angle: dynamicAngle}} radius={outerRadius} hoveredId={hoveredAvatar?.id} onHover={setHoveredAvatar} isAnyHovered={!!hoveredAvatar} isMobile={isMobile} />
                );
              })}
            </div>

            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none orbit-container-reverse z-20 ${hoveredAvatar ? 'paused' : ''}`}>
              {clients.filter(c => c.ring === 'middle').map((client, i, arr) => {
                const dynamicAngle = (360 / arr.length) * i;
                return (
                  <AvatarOrbit key={client.id} client={{...client, angle: dynamicAngle}} radius={middleRadius} hoveredId={hoveredAvatar?.id} onHover={setHoveredAvatar} isAnyHovered={!!hoveredAvatar} isReverse isMobile={isMobile} />
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-10 mt-8 lg:mt-0"
        >
          <p className="text-[#4a6bb1] font-normal text-xl md:text-[22px] mb-1 font-outfit">{t.tag}</p>
          <h2 className="text-[#163c8a] text-6xl md:text-[95px] font-normal leading-none mb-4 font-outfit tracking-tighter">
            <Counter value={clientCount} />
          </h2>
          <h3 className="text-[#163c8a] text-4xl md:text-[58px] font-bold mb-6 font-outfit leading-tight">{t.title}</h3>
          <p className="text-gray-400 text-base md:text-xl leading-relaxed font-outfit">
            {t.desc}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default TrustedClients
