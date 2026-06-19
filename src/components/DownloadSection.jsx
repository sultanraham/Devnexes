import React from 'react'
import { motion } from 'framer-motion'
import { Apple, Play } from 'lucide-react'

import { supabase } from '../supabaseClient'

const DownloadSection = ({ t }) => {
  const [settings, setSettings] = React.useState(null)

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*')
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

    return () => {
      supabase.removeChannel(channel)
    }
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
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-[#061022] via-[#0a192f] to-[#061022]">
      {/* Abstract Vibrant Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-purple-500/10 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[500px] bg-emerald-500/5 rounded-[100%] blur-[120px] pointer-events-none" />
        {/* Subtle grid pattern overlay removed to fix 404 */}
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold tracking-[0.2em] mb-10 shadow-[0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-md uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              In Development
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 text-5xl md:text-6xl lg:text-[80px] font-bold leading-[1.1] mb-6 font-outfit tracking-[-0.02em]"
            >
              {content.title}
            </motion.h2>
            
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-400 text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 font-outfit leading-snug tracking-tight"
            >
              {content.subtitle}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-outfit mb-14 font-medium"
            >
              {content.desc}
            </motion.p>

            {/* CTA Area: QR + Coming Soon */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
            >
              {/* QR Code Premium Card */}
              <div className="relative group cursor-pointer opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative bg-[#0b1121]/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex flex-col items-center hover:border-white/20 transition-all duration-300">
                  <div className="bg-white/80 p-2.5 rounded-2xl mb-4 transition-colors group-hover:bg-white">
                    <img src={content.qr} alt="Scan QR code" className="w-24 h-24 object-contain" />
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-blue-300 transition-colors">Early Access</p>
                </div>
              </div>

              {/* Coming Soon Message */}
              <div className="flex flex-col gap-3 w-full sm:w-auto items-center sm:items-start">
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  App Coming Soon
                </div>
                <p className="text-white/40 text-xs md:text-sm font-medium italic text-center sm:text-left max-w-[200px]">
                  We are working hard to bring this experience to your mobile devices. Stay tuned!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Mobile Mockup */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative mt-16 lg:mt-0 perspective-1000">
            <motion.div 
              initial={{ opacity: 0, rotateY: 20, rotateX: 10, z: -100 }}
              whileInView={{ opacity: 1, rotateY: -10, rotateX: 5, z: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-[300px] md:w-[360px] z-20"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* iPhone Frame */}
              <div className="relative p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-black rounded-[3.5rem] shadow-[20px_20px_60px_rgba(0,0,0,0.6),0_0_80px_rgba(59,130,246,0.3)] border border-slate-700/50">
                {/* Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[140px] h-[32px] bg-black rounded-b-3xl z-40 flex justify-center items-center gap-4">
                  <div className="w-16 h-4 bg-[#111] rounded-full" />
                  <div className="w-3 h-3 bg-[#111] rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[2px]" />
                  </div>
                </div>
                
                {/* Screen */}
                <div className="bg-[#050505] rounded-[3rem] overflow-hidden relative aspect-[9/19.5] border border-white/5">
                  <img 
                    src={content.wallpaper} 
                    alt="Devnexes EduAI educational application mobile preview" 
                    className="w-full h-full object-cover scale-[1.01]"
                  />
                  {/* Premium Screen Glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white-[0.03] to-white/10 pointer-events-none" />
                  <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none transform -translate-y-[40%]" />
                </div>
              </div>

              {/* Abstract Glass Elements behind phone */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 top-20 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl -z-10 hidden md:block"
              />
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-16 bottom-32 w-40 h-40 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl -z-10 hidden md:block transform -rotate-12"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default DownloadSection
