import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, ArrowRight, QrCode } from 'lucide-react'
import { supabase } from '../supabaseClient'

const DownloadSection = ({ t }) => {
  const [settings, setSettings] = React.useState(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*')
        if (data) {
          const sData = {}
          data.forEach(r => sData[r.key] = r.value)
          setSettings(sData)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchSettings()

    const channel = supabase.channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  if (!t && !settings) return null;

  const content = {
    title: settings?.download_title || t?.title || 'DOWNLOAD APP',
    subtitle: settings?.download_subtitle || t?.subtitle || 'Master your project flow.',
    desc: settings?.download_desc || t?.desc || 'Manage your digital operations anytime, anywhere.',
    qr: settings?.qr_url || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://devnexes.site',
    wallpaper: '/images/devnexes-eduai-application.png'
  }

  return (
    <section className="relative min-h-[90vh] py-24 md:py-32 flex items-center overflow-hidden bg-[#020617] font-outfit">
      
      {/* --- Stunning Background Effects --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Deep mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-[#020617] to-[#020617]" />
        
        {/* Animated glowing orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]" 
        />
        
        {/* Noise overlay for premium texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* --- Left Text Content --- */}
          <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 shadow-2xl"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </div>
              <span className="text-white/80 text-xs font-bold tracking-widest uppercase">In Development</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-[85px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/20 mb-4 drop-shadow-sm leading-[1.05]"
            >
              {content.title}
            </motion.h2>
            
            {/* Subtitle */}
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-6 tracking-tight"
            >
              {content.subtitle}
            </motion.h3>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-12"
            >
              {content.desc}
            </motion.p>

            {/* Action Area */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              {/* Premium QR Code Card */}
              <div className="group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-white/20 to-white/5 shadow-2xl cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#020617]/90 backdrop-blur-3xl p-6 rounded-[23px] flex flex-col items-center gap-4 transition-transform duration-300 group-hover:scale-[0.98]">
                  <div className="bg-white p-3 rounded-2xl shadow-inner">
                    <img src={content.qr} alt="Scan QR code" className="w-24 h-24 object-contain filter contrast-125" />
                  </div>
                  <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                    <QrCode size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Early Access</span>
                  </div>
                </div>
              </div>

              {/* Notice Box */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 max-w-[220px]">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">App Coming Soon</span>
                </div>
                <p className="text-white/40 text-[13px] leading-snug italic font-medium">
                  We are working hard to bring this experience to mobile. Stay tuned!
                </p>
              </div>
            </motion.div>
            
          </div>

          {/* --- Right Mobile Mockup Area --- */}
          <div className="flex-1 w-full flex justify-center relative mt-16 lg:mt-0 perspective-1000 lg:h-[700px] items-center">
            
            {/* Floating Graphic behind phone */}
            <motion.div 
              style={{ y }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[400px] pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full blur-[80px]" />
            </motion.div>

            {/* 3D Floating Phone */}
            <motion.div 
              initial={{ opacity: 0, rotateY: 25, rotateX: 15, y: 50 }}
              whileInView={{ opacity: 1, rotateY: -15, rotateX: 5, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              animate={{ 
                y: [0, -15, 0],
                rotateZ: [0, -1, 0]
              }}
              className="relative w-[280px] md:w-[340px] z-20"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Device Frame */}
              <div className="relative p-2.5 bg-gradient-to-br from-slate-700 via-slate-900 to-black rounded-[3rem] shadow-[20px_40px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(59,130,246,0.3)] border border-slate-700/50">
                
                {/* iPhone Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-40 flex justify-center items-center gap-3">
                  <div className="w-12 h-3 bg-[#111] rounded-full border border-white/5" />
                  <div className="w-3 h-3 bg-[#0a0a0a] rounded-full relative overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[1px]" />
                  </div>
                </div>
                
                {/* Screen Content */}
                <div className="bg-black rounded-[2.5rem] overflow-hidden relative aspect-[9/19.5] border border-white/10">
                  <img 
                    src={content.wallpaper} 
                    alt="Devnexes mobile application interface" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* High-end Screen Glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none mix-blend-overlay" />
                  <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none transform -translate-y-1/4 opacity-50" />
                </div>
                
              </div>
              
              {/* Dynamic Floating Glass Cards around phone */}
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-16 top-32 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-30 hidden md:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Smart AI</p>
                  <p className="text-white/50 text-xs">Integrated</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-40 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-30 hidden md:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <ArrowRight size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Fast Flow</p>
                  <p className="text-white/50 text-xs">Optimized</p>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadSection
