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
      <div className="relative z-30 container mx-auto px-6 flex flex-col items-center pt-24 pb-8 md:pb-12">
        
        {/* Top Grid Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full max-w-7xl flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-10 mb-20"
        >
          {/* Column 1: Brand & Desc */}
          <div className="flex flex-col gap-6 lg:w-2/5 pr-4">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all overflow-hidden shadow-lg">
                <img src="/favicon.png" alt="Devnexes" className="w-7 h-7 relative z-10" />
              </div>
              <span className="text-3xl font-bold font-outfit text-white tracking-tight group-hover:text-blue-100 transition-colors">Devnexes</span>
            </Link>
            <p className="text-white/60 text-sm md:text-[15px] leading-relaxed max-w-md font-medium mt-2">
              Empowering businesses through innovative digital solutions. We deliver cutting-edge software development, robust engineering, and technical expertise to drive your growth and digital transformation.
            </p>
          </div>

          {/* Quick Links Container */}
          <div className="flex flex-wrap md:flex-nowrap gap-16 lg:gap-24 w-full lg:w-3/5 justify-start lg:justify-end">
            
            {/* Column 2: Company */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Company</h4>
              <div className="flex flex-col gap-4 mt-1">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Portfolio', to: '/portfolio' },
                  { label: 'Contact Us', to: '/contact' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="text-white/50 hover:text-white text-[15px] font-medium transition-all w-fit">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Legal */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Legal</h4>
              <div className="flex flex-col gap-4 mt-1">
                {[
                  { label: 'Privacy Policy', to: '/policy' },
                  { label: 'Terms & Conditions', to: '/policy' },
                  { label: 'Service Policy', to: '/policy' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} className="text-white/50 hover:text-white text-[15px] font-medium transition-all w-fit">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 4: Contact */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Get In Touch</h4>
              <div className="flex flex-col gap-5 mt-1">
                <a href="mailto:devnexes.support@gmail.com" className="flex items-center gap-3 text-white/60 hover:text-white transition-all group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#0a2351] transition-all shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium tracking-tight">devnexes.support@gmail.com</span>
                </a>
                <a href="https://www.devnexes.site" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-all group">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-[#0a2351] transition-all shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium tracking-tight">www.devnexes.site</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Bottom Sleek Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full max-w-7xl mt-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-white/40 text-sm font-medium tracking-wide text-center md:text-left order-2 md:order-1">
            © {new Date().getFullYear()} Devnexes Digital Solutions. All rights reserved.
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-5 order-1 md:order-2">
            {[
              { href: 'https://linkedin.com/company/devnexes-digital-solutions', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> },
              { href: 'https://instagram.com/devnexes.digital.solutions', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> },
              { href: '#', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/> },
              { href: '#', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/> },
            ].map((social, i) => (
              <motion.a 
                key={i}
                whileHover={{ scale: 1.1, y: -2 }}
                href={social.href}
                target={social.href !== '#' ? "_blank" : undefined}
                rel={social.href !== '#' ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0a2351] hover:bg-white hover:border-white transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{social.icon}</svg>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
