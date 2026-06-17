import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Menu, X, ArrowRight, Layout, Home } from 'lucide-react'

import { translations } from '../translations'

const Navbar = ({ currentLang, setCurrentLang, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'UR', name: 'Urdu', flag: '🇵🇰' },
    { code: 'AR', name: 'Arabic', flag: '🇸🇦' },
  ]

  const t = translations?.[currentLang]?.navbar || translations?.['EN']?.navbar || {}

  useEffect(() => {
    if (!currentLang) {
      console.warn('Navbar: currentLang is undefined, defaulting to EN')
    }
  }, [currentLang])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: t.home, href: '/', },
    { name: 'About', href: '/about', isRoute: true },
    { name: t.projects, href: '/projects', isRoute: true },
    { name: 'Portfolio', href: '/portfolio', isRoute: true },
    { name: 'Policy', href: '/policy', isRoute: true },
  ]

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', href: '/admin', isRoute: true, isAdmin: true })
  }

  const navContent = (
    <>
      <div 
        className={`absolute inset-0 z-0 pointer-events-none bg-cover bg-center transition-opacity duration-700 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: 'url("/navbg.png")' }}
      />

      <div className="flex items-center gap-3 relative z-40 pl-6 md:pl-12">
        <img src="/favicon.png" alt="Devnexes Logo" className="w-8 h-8 object-contain" />
        <div className="text-xl md:text-2xl font-black text-white tracking-tighter font-outfit">
          Devnexes
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-14 text-white/90 font-semibold relative z-40 font-outfit text-[16px]">
        {navLinks.map((link, index) => (
          <motion.div 
            key={link.name} 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 + (index * 0.04) }}
            className="relative group"
          >
            {link.isRoute ? (
              <Link 
                to={link.href} 
                className={`flex items-center gap-1.5 transition-all py-8 relative ${link.isAdmin ? 'text-emerald-400 hover:text-emerald-300' : 'hover:text-white'}`}
              >
                {link.isAdmin && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                {link.name}
                <motion.div 
                  className={`absolute bottom-6 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 ${link.isAdmin ? 'bg-emerald-400' : 'bg-white'}`}
                  whileHover={{ width: '100%' }}
                />
              </Link>
            ) : (
              <a 
                href={link.href} 
                className="flex items-center gap-1.5 hover:text-white transition-all py-8 relative"
              >
                {link.name}
                <motion.div 
                  className="absolute bottom-6 left-0 h-[2px] bg-white w-0 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: '100%' }}
                />
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-6 text-white relative z-40 pr-12">
        <div 
          className="relative"
          onMouseEnter={() => setIsLangOpen(true)}
          onMouseLeave={() => setIsLangOpen(false)}
        >
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group/lang py-4">
            <span className="font-outfit font-bold">{currentLang}</span>
            <Globe size={18} className={`transition-transform duration-500 ${isLangOpen ? 'rotate-180 text-blue-400' : ''}`} />
          </div>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-32"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code)
                      setIsLangOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold font-outfit transition-colors hover:bg-gray-50 ${currentLang === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to="/contact" className="bg-white/10 backdrop-blur-md border border-white/20 px-7 py-2 rounded-xl hover:bg-white/25 transition-all font-bold text-white whitespace-nowrap shadow-xl active:scale-95 relative overflow-hidden group/btn flex items-center justify-center">
           <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
           <span className="relative z-10">{t.contact}</span>
        </Link>

        {user && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-tighter ml-2"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center pr-6 relative z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </>
  )

  const mirrorEffects = (
    <>
      <div className="absolute inset-0 bg-linear-to-b from-white/25 to-transparent opacity-50 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-white/20 opacity-60 z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-white/60 to-transparent opacity-80 z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-40 z-30" />
      {/* Primary Shine */}
      <div className="absolute -inset-full top-0 h-full w-1/2 z-20 block transform skew-x-[-25deg] bg-linear-to-r from-transparent via-white/30 to-transparent opacity-50 animate-shine pointer-events-none" />
      {/* Secondary Fast Shine */}
      <div className="absolute -inset-full top-0 h-full w-1/4 z-20 block transform skew-x-[-25deg] bg-linear-to-r from-transparent via-white/20 to-transparent opacity-30 animate-shine-fast pointer-events-none" />
    </>
  )

  return (
    <nav className="fixed inset-x-0 top-0 z-1000 flex flex-col items-center w-full px-0">
      <AnimatePresence mode='wait'>
        {isScrolled ? (
          <motion.div 
            key="scrolled"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-[#0a2351]/30 backdrop-blur-3xl backdrop-saturate-200 border-b border-white/20 flex items-center justify-between relative shadow-2xl h-[70px]"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {mirrorEffects}
            </div>
            {navContent}
          </motion.div>
        ) : (
          <motion.div 
            key="floating"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-[92%] max-w-[1240px] mt-4 md:mt-6 bg-[#1a2b4b]/20 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 flex items-center justify-between relative shadow-2xl rounded-2xl h-[70px] md:h-[80px]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {mirrorEffects}
            </div>
            {navContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-[#0a2351] backdrop-blur-3xl border-b border-white/10 md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center py-8 gap-6 text-white font-outfit font-semibold">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl hover:text-blue-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-4 mt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-3 py-1 rounded-lg border ${currentLang === lang.code ? 'bg-white text-blue-900' : 'border-white/20 text-white'}`}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>
              <Link 
                to="/#login-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 bg-white/10 border border-white/20 px-10 py-3 rounded-xl font-bold text-center w-full max-w-[240px]"
              >
                {t.contact}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          15% { left: 200%; }
          100% { left: 200%; }
        }
        @keyframes shine-fast {
          0% { left: -150%; }
          20% { left: 250%; }
          100% { left: 250%; }
        }
        .animate-shine {
          animation: shine 6s infinite ease-in-out;
        }
        .animate-shine-fast {
          animation: shine-fast 4s infinite ease-in-out;
          animation-delay: 1s;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
