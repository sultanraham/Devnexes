import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  ArrowRight,
  Code2, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Layout, 
  Users2,
  LogOut
} from 'lucide-react'
import { translations } from '../translations'

export function Navbar({ currentLang, setCurrentLang, user, onLogout }) {
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [activeServiceTab, setActiveServiceTab] = useState("web_dev")

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
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const serviceTabs = [
    {
      id: "web_dev",
      title: "Custom Web Applications",
      icon: Code2,
      desc: "Full-stack web platforms built with React, Next.js, Node.js, and Supabase. Engineered for high speed, security, and scalability.",
      features: [
        "React 19 & Next.js SSR/SSG",
        "Responsive Glassmorphism UI",
        "Express & Node.js API Backend",
        "Supabase PostgreSQL Integration",
        "REST & GraphQL API Engine",
        "SEO-Ready Static Prerendering"
      ],
      link: "/portfolio"
    },
    {
      id: "ai_agents",
      title: "AI Automation & Chatbots",
      icon: Cpu,
      desc: "Intelligent workflow automation, custom LLM integrations, automated data processing, and conversational AI agents.",
      features: [
        "Custom LLM API Integrations",
        "Interactive Chatbot Agents",
        "Local On-Device AI Models",
        "Natural Language SQL (Lexibase)",
        "Workflow Automation Scripts",
        "Real-Time Data Processing"
      ],
      link: "/portfolio"
    },
    {
      id: "seo_perf",
      title: "SEO & Page Speed Optimization",
      icon: Sparkles,
      desc: "Technical SEO audits, Schema.org JSON-LD structured data, Lighthouse 90+ speed tuning, and local search ranking strategies.",
      features: [
        "Schema.org JSON-LD Structuring",
        "Local SEO for Lahore & Gulf",
        "Lighthouse Speed Optimization",
        "Automated Sitemap.xml & Robots",
        "Breadcrumb Navigation Schema",
        "OpenGraph & Social Cards"
      ],
      link: "/portfolio"
    },
    {
      id: "ui_ux",
      title: "UI/UX & 3D Interactive Design",
      icon: Layout,
      desc: "Modern user experience design, 3D WebGL experiences (Three.js), glassmorphism aesthetics, and responsive micro-animations.",
      features: [
        "Figma & Prototyping Design",
        "Tailwind CSS & Framer Motion",
        "3D WebGL & Interactive FX",
        "WCAG AA Accessibility",
        "Mobile-First Responsive Layouts",
        "Design System Tokenization"
      ],
      link: "/portfolio"
    },
    {
      id: "teams",
      title: "Dedicated Engineering Teams",
      icon: Users2,
      desc: "Remote full-stack engineers and AI specialists to accelerate your product development with 1-week post-launch guarantee.",
      features: [
        "Dedicated Remote Developers",
        "Agile Sprint Execution",
        "1-Week Post-Launch Guarantee",
        "1 Free Maintenance Session",
        "Full Codebase Ownership",
        "Direct CTO & COO Supervision"
      ],
      link: "/about"
    }
  ]

  return (
    <header 
      className="fixed top-0 inset-x-0 z-[1000] w-full transition-all duration-300 ease-out font-outfit"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* ── TOP MINI INFO BAR ────────────────────────────────────────── */}
      <div 
        className={`w-full bg-[#040e20] text-white border-b border-blue-900/40 overflow-hidden transition-all duration-300 ease-out ${
          isScrolled 
            ? "max-h-0 opacity-0 py-0 border-none pointer-events-none" 
            : "max-h-16 opacity-100 py-2 px-4 sm:px-8"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between text-xs font-semibold">
          
          {/* Left: Social Media Links */}
          <div className="flex items-center gap-4 text-white/70">
            <a href="https://linkedin.com/company/devnexes-digital-solutions" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://instagram.com/devnexes.digital.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <span className="text-white/20">|</span>
            <span className="text-blue-300/90 text-[11px] hidden sm:inline flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Lahore, Pakistan — Empowering Digital Growth
            </span>
          </div>

          {/* Right: Contact Email & Phone */}
          <div className="flex items-center gap-6 text-white/80 text-xs">
            <a href="mailto:devnexes.support@gmail.com" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>devnexes.support@gmail.com</span>
            </a>

            <a href="tel:+923030111550" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+92 303 0111550</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── MAIN NAVIGATION BAR ──────────────────────────────────────── */}
      <div className={`w-full transition-all duration-300 bg-[#061632]/95 backdrop-blur-2xl border-b border-white/10 text-white shadow-xl ${
        isScrolled ? "py-2.5 shadow-2xl shadow-black/50 border-blue-500/20" : "py-3.5"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group py-1" onClick={() => setActiveMenu(null)}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md group-hover:bg-blue-400/50 transition-all duration-500" />
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 relative z-10 group-hover:scale-105 transition-transform duration-300 border border-white/20">
                  <img src="/images/devnexes-logo.png" alt="Devnexes Logo" className="w-6 h-6 object-contain filter brightness-200 invert-0" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-outfit leading-none">
                  Devnexes<span className="text-blue-400">.</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-blue-400 opacity-90 mt-0.5">
                  Digital Solutions
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <nav className="hidden lg:flex items-center gap-1.5">
              
              {/* Nav Item 1: Services Mega Dropdown */}
              <button
                onClick={() => toggleMenu("services")}
                onMouseEnter={() => setActiveMenu("services")}
                className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-bold rounded-xl transition-all ${
                  activeMenu === "services"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>Services &amp; Solutions</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeMenu === "services" ? "rotate-180 text-blue-300" : "text-white/50"
                }`} />
              </button>

              {/* Nav Item 2: About Us */}
              <Link 
                to="/about" 
                onClick={() => setActiveMenu(null)}
                className={`px-4 py-2 text-[14px] font-bold rounded-xl transition-all ${
                  location.pathname === '/about' 
                    ? "bg-blue-600/80 text-white shadow-md" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                About Us
              </Link>

              {/* Nav Item 3: Portfolio & Work */}
              <Link 
                to="/portfolio" 
                onClick={() => setActiveMenu(null)}
                className={`px-4 py-2 text-[14px] font-bold rounded-xl transition-all ${
                  location.pathname === '/portfolio' 
                    ? "bg-blue-600/80 text-white shadow-md" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Portfolio &amp; Work
              </Link>

              {/* Nav Item 4: Policy & Guarantee */}
              <Link 
                to="/policy" 
                onClick={() => setActiveMenu(null)}
                className={`px-4 py-2 text-[14px] font-bold rounded-xl transition-all ${
                  location.pathname === '/policy' 
                    ? "bg-blue-600/80 text-white shadow-md" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                Policy &amp; Guarantee
              </Link>

            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-3">

              {/* Language Dropdown Selector */}
              <div 
                className="relative hidden sm:block"
                onMouseEnter={() => setIsLangOpen(true)}
                onMouseLeave={() => setIsLangOpen(false)}
              >
                <button 
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-white/10 hover:bg-white/20 border border-white/15 text-white"
                  aria-label="Select Language"
                >
                  <Globe size={14} className="text-blue-400" />
                  <span>{currentLang}</span>
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1.5 bg-[#061632] text-white border border-white/20 rounded-2xl shadow-2xl overflow-hidden min-w-[135px] p-1.5 z-50 backdrop-blur-2xl"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang.code)
                            setIsLangOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            currentLang === lang.code 
                              ? 'bg-blue-600 text-white font-extrabold shadow-md' 
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

              {/* Book Consultation Button */}
              <Link to="/contact" onClick={() => setActiveMenu(null)}>
                <button className="group relative inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-outfit h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 active:scale-95 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">{t.contact || 'Book Consultation'}</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              {/* User Logout Icon */}
              {user && (
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-400/30 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                >
                  <LogOut size={14} />
                </button>
              )}

              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ── ANIMATED MEGA SUBHEADER OVERLAY PANEL ─────────────────────── */}
      <AnimatePresence>
        {activeMenu === "services" && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full inset-x-0 bg-[#071938]/98 backdrop-blur-2xl text-white border-t-4 border-blue-500 border-b border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50 pointer-events-auto"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT SIDEBAR NAVIGATION */}
                <div className="lg:col-span-5 space-y-1.5">
                  <span className="text-xs font-black tracking-widest text-blue-400 uppercase mb-3 block px-4 font-sans">
                    OUR CORE CAPABILITIES
                  </span>
                  {serviceTabs.map((tab) => {
                    const IconComp = tab.icon;
                    const isActive = activeServiceTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onMouseEnter={() => setActiveServiceTab(tab.id)}
                        onClick={() => setActiveServiceTab(tab.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 border border-white/20"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-blue-400"}`} />
                          <span>{tab.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-white" : "text-white/30"}`} />
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT CONTENT DISPLAY PANEL */}
                <div className="lg:col-span-7 pl-4 space-y-5">
                  {(() => {
                    const currentTab = serviceTabs.find(t => t.id === activeServiceTab) || serviceTabs[0];
                    if (!currentTab) return null;
                    const IconMain = currentTab.icon;
                    return (
                      <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        {/* Service Header & Description */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 border border-white/20">
                            <IconMain className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-extrabold text-white leading-tight">
                              {currentTab.title}
                            </h3>
                            <p className="text-xs text-white/60 leading-relaxed max-w-xl">
                              {currentTab.desc}
                            </p>
                          </div>
                        </div>

                        {/* 2-Column Bullet Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 pb-4 border-t border-b border-white/10">
                          {currentTab.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-white/90">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom CTA Action Link */}
                        <Link 
                          to={currentTab.link}
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 group transition-colors"
                        >
                          <span>Explore {currentTab.title} work</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE MENU OVERLAY ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full lg:hidden overflow-hidden border-t border-white/10 bg-[#061632] text-white px-4 pt-3 pb-6"
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10"
              >
                About Us
              </Link>
              <Link
                to="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10"
              >
                Portfolio &amp; Work
              </Link>
              <Link
                to="/policy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-white/10"
              >
                Policy &amp; Guarantee
              </Link>

              {/* Mobile Languages */}
              <div className="flex items-center justify-around bg-white/5 border border-white/10 rounded-xl p-2 mt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                      currentLang === lang.code ? 'bg-blue-600 text-white shadow-md' : 'text-white/60'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code}</span>
                  </button>
                ))}
              </div>

              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-600/30">
                  Book Consultation
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}

export default Navbar
