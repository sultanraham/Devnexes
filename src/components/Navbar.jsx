import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Globe, Menu, X, ArrowRight, Sparkles, User, LogOut } from 'lucide-react'
import { translations } from '../translations'

const Navbar = ({ currentLang, setCurrentLang, user, onLogout }) => {
  const location = useLocation()
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: t.home || 'Home', href: '/', isRoute: false },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Portfolio', href: '/portfolio', isRoute: true },
    { name: 'Policy', href: '/policy', isRoute: true },
  ]

  const isActive = (link) => {
    if (link.isRoute) return location.pathname === link.href
    return location.pathname === '/' && !location.hash
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] flex justify-center px-3 md:px-6 pt-3 md:pt-5 transition-all duration-500">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className={`w-full transition-all duration-500 relative ${
          isScrolled
            ? 'max-w-6xl bg-[#061632]/85 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.4)] rounded-full px-5 py-2.5'
            : 'max-w-7xl bg-[#091e42]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] rounded-full md:rounded-2xl px-6 py-3 md:py-3.5'
        }`}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between relative z-20">

          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md group-hover:bg-blue-400/50 transition-all duration-500" />
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img src="/images/devnexes-logo.png" alt="Devnexes Logo" className="w-6 h-6 object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-white tracking-tight font-outfit leading-none">
                Devnexes
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400 opacity-90">
                Digital Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <div key={link.name} className="relative">
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className={`relative px-5 py-2 rounded-full text-sm font-bold font-outfit transition-all duration-300 flex items-center gap-1.5 ${
                        active
                          ? 'text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_16px_rgba(37,99,235,0.4)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={`relative px-5 py-2 rounded-full text-sm font-bold font-outfit transition-all duration-300 flex items-center gap-1.5 ${
                        active
                          ? 'text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_16px_rgba(37,99,235,0.4)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">

            {/* Language Selector */}
            <div 
              className="relative"
              onMouseEnter={() => setIsLangOpen(true)}
              onMouseLeave={() => setIsLangOpen(false)}
            >
              <button 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-full text-white text-xs font-bold font-outfit transition-all"
                aria-label="Select Language"
              >
                <Globe size={14} className="text-blue-400" />
                <span>{currentLang}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 bg-[#061632] border border-white/20 rounded-2xl shadow-2xl overflow-hidden min-w-[130px] p-1.5 z-50 backdrop-blur-2xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code)
                          setIsLangOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold font-outfit transition-all ${
                          currentLang === lang.code 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact CTA Button */}
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white text-xs md:text-sm font-bold font-outfit px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.5)] transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">{t.contact || 'Get In Touch'}</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Logged in User Badge */}
            {user && (
              <button
                onClick={onLogout}
                title="Logout"
                className="w-9 h-9 rounded-full bg-red-500/15 border border-red-400/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
              >
                <LogOut size={14} />
              </button>
            )}

          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/contact"
              className="bg-blue-600 text-white text-xs font-bold font-outfit px-4 py-2 rounded-full shadow-md"
            >
              Contact
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="text-white p-2 bg-white/10 border border-white/15 rounded-full focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full md:hidden overflow-hidden border-t border-white/10 mt-3 pt-4 pb-2"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const active = isActive(link)
                  return link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-5 py-3 rounded-2xl text-base font-bold font-outfit transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && <Sparkles size={16} className="text-white" />}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-5 py-3 rounded-2xl text-base font-bold font-outfit transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && <Sparkles size={16} className="text-white" />}
                    </a>
                  )
                })}

                {/* Mobile Languages */}
                <div className="flex items-center justify-around bg-white/5 border border-white/10 rounded-2xl p-2 mt-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-outfit flex items-center gap-2 transition-all ${
                        currentLang === lang.code ? 'bg-white text-blue-900 shadow-md' : 'text-white/70'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.code}</span>
                    </button>
                  ))}
                </div>

                {user && (
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false) }}
                    className="w-full mt-2 bg-red-500/15 border border-red-400/30 text-red-400 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Logout ({user.username})
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}

export default Navbar
