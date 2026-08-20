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
      className={`fixed top-0 inset-x-0 z-[1000] w-full transition-all duration-300 ease-out font-outfit ${
        isScrolled 
          ? "bg-[#1e3a8a] backdrop-blur-md border-b border-blue-800 text-white shadow-xl shadow-blue-950/30" 
          : "bg-white border-b border-slate-200/80 text-slate-900 shadow-xs"
      }`}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* ── TOP MINI INFO BAR (Royal Brand Blue) ───────────────────────── */}
      <div 
        className={`w-full bg-[#1e3a8a] text-white border-b border-blue-800/80 overflow-hidden transition-all duration-300 ease-out shadow-xs ${
          isScrolled 
            ? "max-h-0 opacity-0 py-0 border-none pointer-events-none" 
            : "max-h-16 opacity-100 py-2.5 px-4 sm:px-8"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between text-xs font-semibold">
          
          {/* Left: Social Media Links (LinkedIn, Instagram, Facebook) */}
          <div className="flex items-center gap-3 sm:gap-4 text-white/80">
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/company/devnexes-digital-solutions" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-blue-400 hover:bg-white/10 px-2 py-0.5 rounded transition-all"
              aria-label="LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <span className="text-[11px] font-bold hidden sm:inline">LinkedIn</span>
            </a>

            <span className="text-white/20">|</span>

            {/* Instagram */}
            <a 
              href="https://instagram.com/devnexes.digital.solutions" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-pink-400 hover:bg-white/10 px-2 py-0.5 rounded transition-all"
              aria-label="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span className="text-[11px] font-bold hidden sm:inline">Instagram</span>
            </a>

            <span className="text-white/20">|</span>

            {/* Facebook */}
            <a 
              href="https://facebook.com/devnexes.digital.solutions" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-blue-400 hover:bg-white/10 px-2 py-0.5 rounded transition-all"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="text-[11px] font-bold hidden sm:inline">Facebook</span>
            </a>
          </div>

          {/* Right: Contact Email & Phone */}
          <div className="flex items-center gap-3 text-white/90 text-xs">
            <a href="mailto:devnexes.support@gmail.com" className="flex items-center gap-1.5 hover:bg-white/10 hover:text-white px-2.5 py-1 rounded-md transition-all">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">devnexes.support@gmail.com</span>
            </a>

            <a href="tel:+923030111550" className="flex items-center gap-1.5 hover:bg-white/10 hover:text-white px-2.5 py-1 rounded-md transition-all">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">+92 303 0111550</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── MAIN NAVIGATION BAR ──────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Brand Logo & Name (Clean & Simple - Transparent Logo) */}
          <Link to="/" className="flex items-center gap-3 group py-2" onClick={() => setActiveMenu(null)}>
            <img 
              src="/images/devnexes-logo.png" 
              alt="Devnexes Logo" 
              className="w-8 h-8 md:w-9 md:h-9 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className={`text-xl sm:text-2xl font-black tracking-tight font-outfit transition-colors ${
              isScrolled ? "text-white" : "text-[#061632]"
            }`}>
              Devnexes<span className={isScrolled ? "text-blue-400" : "text-blue-600"}>.</span>
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-2">
            
            {/* Nav Item 1: Services (Mega Dropdown) */}
            <button
              onClick={() => toggleMenu("services")}
              onMouseEnter={() => setActiveMenu("services")}
              className={`flex items-center gap-1.5 px-4 py-2 text-[14px] font-bold rounded-lg transition-all ${
                activeMenu === "services"
                  ? isScrolled ? "bg-blue-800/60 text-white" : "bg-blue-50 text-blue-600"
                  : isScrolled ? "text-white/90 hover:bg-blue-900/40 hover:text-white" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                activeMenu === "services" ? "rotate-180" : ""
              } ${isScrolled ? "text-blue-300" : "text-slate-400"}`} />
            </button>

            {/* Nav Item 2: Portfolio */}
            <Link 
              to="/portfolio" 
              onClick={() => setActiveMenu(null)}
              className={`px-4 py-2 text-[14px] font-bold rounded-lg transition-all ${
                isScrolled ? "text-white/90 hover:bg-blue-900/40 hover:text-white" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              Portfolio
            </Link>

            {/* Nav Item 3: Privacy & Policy */}
            <Link 
              to="/policy" 
              onClick={() => setActiveMenu(null)}
              className={`px-4 py-2 text-[14px] font-bold rounded-lg transition-all ${
                isScrolled ? "text-white/90 hover:bg-blue-900/40 hover:text-white" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              Privacy &amp; Policy
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                  isScrolled 
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20" 
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
                aria-label="Select Language"
              >
                <Globe size={14} className={isScrolled ? "text-blue-300" : "text-blue-600"} />
                <span>{currentLang}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-xl overflow-hidden min-w-[130px] p-1.5 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code)
                          setIsLangOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
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

            {/* Book Consultation Button */}
            <Link to="/contact" onClick={() => setActiveMenu(null)}>
              <button className={`text-xs sm:text-sm font-bold h-10 px-5 rounded-lg transition-all flex items-center gap-2 ${
                isScrolled 
                  ? "bg-white text-[#061632] hover:bg-blue-50 shadow-md font-extrabold" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25"
              }`}>
                <span>{t.contact || 'Book Consultation'}</span>
                <ArrowRight size={14} />
              </button>
            </Link>

            {/* User Logout Icon */}
            {user && (
              <button
                onClick={onLogout}
                title="Logout"
                className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
              >
                <LogOut size={14} />
              </button>
            )}

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "text-white bg-white/10" : "text-slate-700 bg-slate-100"
              }`}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* ── ANIMATED MEGA SUBHEADER OVERLAY PANEL (NexERP Style) ─────── */}
      <AnimatePresence>
        {activeMenu === "services" && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full inset-x-0 bg-white text-slate-900 border-t-4 border-blue-600 border-b border-slate-200 shadow-2xl shadow-black/20 overflow-hidden z-50 pointer-events-auto"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT SIDEBAR NAVIGATION */}
                <div className="lg:col-span-5 space-y-1">
                  <span className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3 block px-4 font-sans">
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
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                            : "text-slate-800 hover:text-blue-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-blue-600"}`} />
                          <span>{tab.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-white" : "text-slate-400"}`} />
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
                      <div className="space-y-6">
                        {/* Service Header & Description (Corporate Minimalist Layout) */}
                        <div className="space-y-2 border-l-2 border-blue-600 pl-4 py-0.5">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                            {currentTab.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-medium">
                            {currentTab.desc}
                          </p>
                        </div>

                        {/* 2-Column Bullet Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 pb-4 border-t border-b border-slate-100">
                          {currentTab.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom CTA Action Link */}
                        <Link 
                          to={currentTab.link}
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group transition-colors"
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
            className="w-full lg:hidden overflow-hidden border-t border-slate-200 bg-white text-slate-900 px-4 pt-3 pb-6"
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50"
              >
                Portfolio
              </Link>
              <Link
                to="/policy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-50"
              >
                Privacy &amp; Policy
              </Link>

              {/* Mobile Languages */}
              <div className="flex items-center justify-around bg-slate-50 border border-slate-200 rounded-xl p-2 mt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                      currentLang === lang.code ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code}</span>
                  </button>
                ))}
              </div>

              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-md">
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
