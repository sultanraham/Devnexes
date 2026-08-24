import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, MapPin, ArrowUp, Phone, ArrowUpRight, Globe } from 'lucide-react'

const Footer = ({ t }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full overflow-hidden bg-[#061632] font-outfit text-white border-t border-white/10">
      {/* 1. Base Layer: Original Devnexes Background Graphic */}
      <img
        src="/images/devnexes-digital-solutions-footer-background.png"
        alt="Devnexes Digital Solutions footer background"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none opacity-85"
      />

      {/* 2. Clouds Overlay Layer (Clearly Visible Cloud Effect) */}
      <img
        src="/images/devnexes-digital-solutions-footer-clouds.png"
        alt="Devnexes Digital Solutions footer clouds"
        className="absolute inset-0 w-full h-full object-cover object-bottom opacity-75 z-10 pointer-events-none mix-blend-screen"
      />

      {/* 3. Subtle Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061632]/90 via-[#061632]/40 to-[#061632]/80 z-20 pointer-events-none" />

      {/* Main Full-Width Content Container */}
      <div className="relative z-30 w-full px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24 pt-16 pb-8 flex flex-col justify-between">

        {/* Top Grid Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 pb-12">
          
          {/* Column 1: Brand & Identity (Clean Transparent Logo - No Box) (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 pr-0 lg:pr-6">
            <Link to="/" className="flex items-center gap-3.5 group w-fit">
              <img
                src="/images/devnexes-logo.png"
                alt="Devnexes Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  Devnexes
                </span>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em] -mt-0.5">
                  Digital Solutions
                </span>
              </div>
            </Link>

            <p className="text-slate-200 text-sm sm:text-[15px] leading-relaxed font-normal max-w-sm">
              {t?.footerDesc ||
                'Web Development • AI Automation • SEO • UI/UX Design • Chatbots. Architecting next-generation digital platforms and intelligent software systems for global visionary businesses.'}
            </p>

            <div className="flex flex-col gap-3 text-xs text-slate-300 font-medium pt-1">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-white">Lahore, Pakistan • Global Operations</span>
              </div>
            </div>
          </div>

          {/* Column 2: Services (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.18em]">
              Services & Tech
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Web Applications', to: '/#features' },
                { label: 'AI Automation & Agents', to: '/#features' },
                { label: 'Custom SaaS & Cloud Systems', to: '/portfolio' },
                { label: 'UI / UX Product Design', to: '/#features' },
                { label: 'SEO & Growth Strategy', to: '/#features' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm md:text-[15px] font-medium transition-all duration-150 hover:translate-x-1.5"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.18em]">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'About Devnexes', to: '/about' },
                { label: 'Featured Portfolio', to: '/portfolio' },
                { label: 'Contact Inquiries', to: '/contact' },
                { label: 'Privacy Policy', to: '/policy' },
                { label: 'Terms of Service', to: '/policy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm md:text-[15px] font-medium transition-all duration-150 hover:translate-x-1.5"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch (3 cols with full-width text & more channels) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.18em]">
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:devnexes.support@gmail.com"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/15 group-hover:bg-white group-hover:text-[#061632] group-hover:border-white transition-all shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">devnexes.support@gmail.com</span>
              </a>

              <a
                href="https://wa.me/923030111550"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/15 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">+92 303 0111550</span>
              </a>

              <a
                href="https://www.linkedin.com/company/devnexes-digital-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/15 group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5] transition-all shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">LinkedIn</span>
              </a>

              <a
                href="https://instagram.com/devnexes.digital.solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/15 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">Instagram</span>
              </a>

              <a
                href="https://www.devnexes.site"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/15 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-all shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">www.devnexes.site</span>
              </a>
            </div>
          </div>

        </div>

        {/* Visible DEVNEXES Signature Typography */}
        <div className="w-full select-none pointer-events-none py-4 flex justify-center items-center overflow-hidden">
          <span className="text-[13vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 via-white/10 to-transparent leading-none whitespace-nowrap font-outfit select-none">
            DEVNEXES
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-300">
          <div>
            © {currentYear} <span className="text-white font-medium">Devnexes Digital Solutions</span>. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer group font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-blue-400" />
          </button>
        </div>

      </div>
    </footer>
  )
}

export default Footer




