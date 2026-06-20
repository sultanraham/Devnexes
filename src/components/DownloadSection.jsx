import React from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'

const DownloadSection = ({ t }) => {
  const [settings, setSettings] = React.useState(null)

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
    <section className="relative py-24 md:py-32 flex items-center overflow-hidden bg-[#061022] font-outfit">
      
      {/* --- Clean Minimal Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* --- Left Text Content --- */}
          <div className="flex-1 text-center lg:text-left">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase">In Development</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]"
            >
              {content.title}
            </motion.h2>
            
            {/* Subtitle */}
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-400 mb-6"
            >
              {content.subtitle}
            </motion.h3>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 mb-12"
            >
              {content.desc}
            </motion.p>

            {/* Action Area */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start"
            >
              {/* QR Code Card */}
              <div className="bg-[#0b1324] p-5 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center gap-3">
                <div className="bg-white p-2 rounded-2xl">
                  <img src={content.qr} alt="Scan QR code" className="w-24 h-24 object-contain" />
                </div>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Early Access</span>
              </div>

              {/* Notice Box */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 max-w-[200px]">
                <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-amber-500/30">
                  <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">App Coming Soon</span>
                </div>
                <p className="text-white/40 text-[12px] leading-relaxed italic font-medium">
                  We are working hard to bring this experience to your mobile devices. Stay tuned!
                </p>
              </div>
            </motion.div>
            
          </div>

          {/* --- Right Mobile Mockup Area --- */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative mt-16 lg:mt-0">
            
            {/* Clean White iPhone */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[280px] md:w-[320px] z-20"
            >
              {/* Device Frame */}
              <div className="relative p-3 bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-[#f0f0f0]">
                
                {/* iPhone Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-40 flex justify-center items-center gap-3">
                  <div className="w-12 h-3 bg-[#1a1a1a] rounded-full" />
                  <div className="w-3 h-3 bg-[#1a1a1a] rounded-full" />
                </div>
                
                {/* Screen Content */}
                <div className="bg-white rounded-[2.5rem] overflow-hidden relative w-full h-full flex flex-col">
                  <img 
                    src={content.wallpaper} 
                    alt="Devnexes mobile application interface" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default DownloadSection
