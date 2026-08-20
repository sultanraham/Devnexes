import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const COOKIE_KEY = 'devnexes_cookie_consent'

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,     // Always on — session, auth, security
    analytics: false,    // Visitor tracking, heartbeat
    functional: false,   // Language preference, theme
  })

  useEffect(() => {
    // Check if user has already made a choice
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const consent = { necessary: true, analytics: true, functional: true, timestamp: Date.now() }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent))
    setVisible(false)
  }

  const acceptSelected = () => {
    const consent = { ...preferences, necessary: true, timestamp: Date.now() }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent))
    setVisible(false)
  }

  const rejectAll = () => {
    const consent = { necessary: true, analytics: false, functional: false, timestamp: Date.now() }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent))
    setVisible(false)
  }

  const togglePreference = (key) => {
    if (key === 'necessary') return // Can't disable necessary
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const cookieTypes = [
    {
      key: 'necessary',
      label: 'Essential Cookies',
      description: 'Required for the website to function properly. Includes authentication, security tokens, and session management.',
      locked: true,
    },
    {
      key: 'analytics',
      label: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous visitor session data.',
      locked: false,
    },
    {
      key: 'functional',
      label: 'Functional Cookies',
      description: 'Remember your preferences such as language selection and display settings for a personalized experience.',
      locked: false,
    },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            onClick={() => {}}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-5xl mx-auto">
              <div className="relative bg-white rounded-3xl shadow-[0_-4px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden">
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
                
                {/* Ambient glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100/40 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10 p-6 md:p-8">
                  
                  {/* Header Row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0 mt-0.5">
                      <Cookie size={22} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#0a192f] text-lg md:text-xl font-bold font-outfit tracking-tight mb-1">
                        We Value Your Privacy
                      </h3>
                      <p className="text-slate-500 text-sm md:text-[15px] leading-relaxed font-medium">
                        We use cookies and similar technologies to enhance your browsing experience, 
                        analyze site traffic, and improve our services. You can customize your preferences below.
                        {' '}
                        <Link to="/policy" className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 pt-5 pb-2 mb-4 space-y-3">
                          {cookieTypes.map((cookie) => (
                            <div 
                              key={cookie.key}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                preferences[cookie.key] 
                                  ? 'bg-blue-50/70 border-blue-200' 
                                  : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[#0a192f] font-semibold text-sm font-outfit">{cookie.label}</span>
                                  {cookie.locked && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                      Required
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed">{cookie.description}</p>
                              </div>
                              
                              {/* Toggle Switch */}
                              <button
                                onClick={() => togglePreference(cookie.key)}
                                disabled={cookie.locked}
                                className={`relative w-12 h-7 rounded-full transition-all duration-300 shrink-0 ${
                                  preferences[cookie.key] 
                                    ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.3)]' 
                                    : 'bg-slate-200'
                                } ${cookie.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                              >
                                <motion.div
                                  animate={{ x: preferences[cookie.key] ? 22 : 3 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    
                    {/* Customize Toggle */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-semibold font-outfit transition-colors py-2.5 px-4 rounded-xl hover:bg-slate-50 order-3 sm:order-1"
                    >
                      <Shield size={14} />
                      {showDetails ? 'Hide' : 'Customize'}
                      {showDetails ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>

                    <div className="flex-1 hidden sm:block order-2" />

                    {/* Reject Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={rejectAll}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 px-6 py-3 rounded-xl font-bold text-sm font-outfit transition-all order-2 sm:order-3"
                    >
                      Reject All
                    </motion.button>

                    {/* Accept Selected (only when details are open) */}
                    {showDetails && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={acceptSelected}
                        className="bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[#0a192f] px-6 py-3 rounded-xl font-bold text-sm font-outfit transition-all order-3 sm:order-4"
                      >
                        Save Preferences
                      </motion.button>
                    )}

                    {/* Accept All Button */}
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(37,99,235,0.25)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm font-outfit shadow-lg shadow-blue-600/20 transition-all relative overflow-hidden group order-1 sm:order-5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10">Accept All</span>
                    </motion.button>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Helper: Check if a specific cookie type was accepted
export const getCookieConsent = (type = 'analytics') => {
  try {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) return false
    const consent = JSON.parse(saved)
    return consent[type] === true
  } catch {
    return false
  }
}

// Helper: Reset cookie consent (useful for policy page "manage cookies" link)
export const resetCookieConsent = () => {
  localStorage.removeItem(COOKIE_KEY)
  window.location.reload()
}

export default CookieConsent
