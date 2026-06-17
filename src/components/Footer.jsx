import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = ({ t }) => {
  if (!t) return null;
  return (
    <footer className="relative w-full overflow-hidden bg-[#0a2351] font-outfit">
      {/* 1. Base Layer: footer.png */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat z-0"
        style={{ backgroundImage: "url('/footer.png')" }}
      />

      {/* 2. Overlay Layer: footer-cloud.png */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-80 z-10 pointer-events-none"
        style={{ backgroundImage: "url('/footer-cloud.png')" }}
      />

      {/* 3. Top Gradient Blend - Optimized for No Merging */}
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#f8faff] via-[#f8faff]/50 to-transparent z-20 pointer-events-none" />

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-30 container mx-auto px-6 flex flex-col items-center pt-16 pb-6 md:pb-10"
      >
        
        {/* Policy Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {[
            { label: 'Privacy Policy', to: '/policy' },
            { label: 'Terms & Conditions', to: '/policy' },
            { label: 'Service Policy', to: '/policy' },
            { label: 'About Us', to: '/about' },
            { label: 'Portfolio', to: '/portfolio' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="text-white/30 hover:text-white/70 text-xs font-medium transition-all tracking-wide">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact Links Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 mb-12 w-full text-center">
          <motion.a 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            href="mailto:devnexes.support@gmail.com"
            className="flex flex-col md:flex-row items-center gap-4 text-white hover:text-blue-300 transition-all group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#0a2351] transition-all">
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-base md:text-[17px] font-medium tracking-tight">devnexes.support@gmail.com</span>
          </motion.a>

          <motion.a 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            href="https://www.devnexes.site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center gap-4 text-white hover:text-blue-300 transition-all group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#0a2351] transition-all">
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <span className="text-base md:text-[17px] font-medium tracking-tight">www.devnexes.site</span>
          </motion.a>
        </div>

        {/* Bottom Sleek Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl mt-auto"
        >
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-6 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            
            {/* Social Icons */}
            <div className="flex items-center gap-8 md:gap-10">
              {[
                { icon: <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.16 5.4-7.84 5.4-4.8 0-8.72-3.88-8.72-8.72s3.92-8.72 8.72-8.72c2.72 0 4.56 1.16 5.6 2.16l2.56-2.56C19.12 1.48 16.12 0 12.48 0 5.6 0 0 5.6 0 12.48S5.6 24.96 12.48 24.96c7.2 0 12-5.04 12-12.24 0-.84-.08-1.48-.24-2.16h-11.76z"/> },
                { icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
                { icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
                { icon: <path d="M3.609 0c-.806 0-1.492.482-1.742 1.157L11.54 11.66l1.248-1.249L3.609 0zm11.23 11.23l-1.248 1.249 8.273 8.273c.675-.25 1.157-.936 1.157-1.742V5.12c0-.806-.482-1.492-1.157-1.742L14.84 11.23zM12.789 13.24L1.867 24h15.932l-3.143-3.143-1.867 1.867-1.249-1.249 1.249-1.249-1.249-1.249 1.249-1.249L12.789 13.24zM0 2.247v19.506l10.292-10.292L0 2.247z"/> }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 15,
                    color: "#ffffff"
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    delay: i * 0.1 
                  }}
                  href="#" 
                  className="text-white/60 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">{social.icon}</svg>
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-white/80 text-sm md:text-base font-medium tracking-wide text-center">
              © Devnexes Digital Solutions. All rights reserved.
            </div>

            <div className="hidden md:block w-32"></div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer
