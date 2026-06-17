import React from 'react'
import { motion } from 'framer-motion'

const DownloadSection = ({ t }) => {
  const [settings, setSettings] = React.useState(null)
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

  React.useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setSettings(data) })
      .catch(err => console.error(err))
  }, [API_BASE])

  if (!t && !settings) return null;

  const content = {
    title: settings?.download_title || t?.title || 'DOWNLOAD APP',
    subtitle: settings?.download_subtitle || t?.subtitle || 'Master your project flow.',
    desc: settings?.download_desc || t?.desc || 'Manage your digital operations anytime, anywhere.',
    qr: settings?.qr_url || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://devnexes.site',
    wallpaper: settings?.mobile_wallpaper || 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&q=80&w=800'
  }

  return (
    <section className="relative pt-16 md:pt-24 pb-0 overflow-hidden z-10 bg-[#0A1F44]">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: 'url("/download_bg.png")' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 max-w-7xl relative z-10"
      >
        {/* Header Content */}
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-5xl md:text-7xl lg:text-[80px] font-bold leading-none mb-4 font-outfit tracking-tight"
          >
            {content.title}
          </motion.h2>
          
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-white text-xl md:text-2xl lg:text-[28px] font-bold mb-4 font-outfit"
          >
            {content.subtitle}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/70 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-outfit"
          >
            {content.desc}
          </motion.p>
        </div>

        {/* Assets Row */}
        <div className="relative w-full flex flex-col md:flex-row items-center md:items-end justify-center gap-10 md:gap-0 h-auto md:h-[420px]">
          
          {/* QR Code */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 1 }}
            className="md:absolute md:left-0 lg:left-10 md:bottom-20 z-30"
          >
            <div className="bg-white p-3 rounded-2xl shadow-2xl">
              <div className="w-32 h-32 md:w-40 md:h-40">
                <img 
                  src={content.qr} 
                  alt="Scan QR code to visit devnexes.site" 
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="160"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center mt-2 uppercase tracking-widest">Scan to Experience</p>
            </div>
          </motion.div>

          {/* IPHONE MOCKUP */}
          <motion.div 
            initial={{ opacity: 0, y: 200, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 20, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[280px] md:w-[400px] lg:w-[450px] z-20 translate-y-[20px]"
          >
            <div className="relative p-[8px] md:p-[10px] bg-black rounded-t-[40px] md:rounded-t-[60px] border-x-2 border-t-2 border-gray-900 shadow-2xl">
              
              {/* Notch */}
              <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[100px] md:w-[180px] h-[20px] md:h-[30px] bg-black rounded-b-[16px] md:rounded-b-[24px] z-40" />

              {/* Screen Area */}
              <div className="bg-[#121212] rounded-t-[32px] md:rounded-t-[50px] overflow-hidden min-h-[350px] md:min-h-[450px] relative">
                <img 
                  src={content.wallpaper} 
                  alt="Devnexes app interface preview" 
                  loading="lazy"
                  decoding="async"
                  width="450"
                  height="600"
                  className="w-full h-auto object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #0A1F44 0%, #1e293b 100%)';
                    e.target.parentElement.innerHTML += '<div class="p-10 text-white/10 font-bold text-2xl md:text-3xl mt-20 md:mt-32 text-center uppercase tracking-widest">Live UI Preview</div>';
                  }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}

export default DownloadSection
