import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Globe, Menu, X, ArrowRight, LogOut } from 'lucide-react'
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
      setIsScrolled(window.scrollY > 20)
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
    <header className="fixed inset-x-0 top-0 z-[1000] w-full">
      <nav
        className={`w-full transition-all duration-300 bg-white ${
          isScrolled
            ? 'border-b border-slate-200/80 shadow-md py-3'
            : 'border-b border-slate-100 shadow-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">

          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img src="/images/devnexes-logo.png" alt="Devnexes Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-[#061632] tracking-tight font-outfit leading-none">
                Devnexes
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-600 mt-0.5">
                Digital Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <div key={link.name}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className={`px-5 py-2 rounded-full text-sm font-bold font-outfit transition-all duration-200 ${
                        active
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-xs'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={`px-5 py-2 rounded-full text-sm font-bold font-outfit transition-all duration-200 ${
                        active
                          ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-xs'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
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
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-full text-slate-700 text-xs font-bold font-outfit transition-all"
                aria-label="Select Language"
              >
                <Globe size={14} className="text-blue-600" />
                <span>{currentLang}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden min-w-[130px] p-1.5 z-50"
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
                            ? 'bg-blue-50 text-blue-600 font-extrabold' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm font-bold font-outfit px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">{t.contact || 'Get In Touch'}</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Logged in User Logout Badge */}
            {user && (
              <button
                onClick={onLogout}
                title="Logout"
                className="w-9 h-9 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
              >
                <LogOut size={14} />
              </button>
            )}

          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/contact"
              className="bg-blue-600 text-white text-xs font-bold font-outfit px-4 py-2 rounded-full shadow-sm"
            >
              Contact
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className="text-slate-700 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl focus:outline-none"
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
              transition={{ duration: 0.25 }}
              className="w-full md:hidden overflow-hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 mt-3"
            >
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const active = isActive(link)
                  return link.isRoute ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold font-outfit transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold font-outfit transition-all flex items-center justify-between ${
                        active 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                    </a>
                  )
                })}

                {/* Mobile Languages */}
                <div className="flex items-center justify-around bg-slate-50 border border-slate-100 rounded-xl p-2 mt-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold font-outfit flex items-center gap-2 transition-all ${
                        currentLang === lang.code ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500'
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
                    className="w-full mt-2 bg-red-50 border border-red-200 text-red-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Logout ({user.username})
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
