import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const COOKIE_KEY = 'devnexes_cookie_consent'

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,     // Always on — session, auth, security
    analytics: false,    // Visitor tracking, performance
    functional: false,   // Language, theme preferences
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
    if (key === 'necessary') return
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const cookieTypes = [
    {
      key: 'necessary',
      label: 'Essential Cookies',
      description: 'Required for the website to function properly. Includes security tokens, navigation, and session authentication.',
      locked: true,
    },
    {
      key: 'analytics',
      label: 'Analytics Cookies',
      description: 'Help us improve our website performance and user experience by collecting anonymous usage analytics.',
      locked: false,
    },
    {
      key: 'functional',
      label: 'Functional Cookies',
      description: 'Remember your preferred settings like language selection and interface customizations.',
      locked: false,
    },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Subtle Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-xs z-[9998]"
            onClick={() => {}}
          />

          {/* Cookie Banner (White Theme, Devnexes Transparent Logo, Toggle Switches, Soft Rounded Corners) */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 select-none"
          >
            <div className="max-w-5xl mx-auto">
              <div className="relative bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-xl">
                
                {/* Top accent border */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

                <div className="p-6 md:p-8">
                  
                  {/* Header Row */}
                  <div className="flex items-start gap-4 sm:gap-5 mb-5">
                    {/* Transparent Devnexes Logo (No Box/Background) */}
                    <img
                      src="/images/devnexes-logo.png"
                      alt="Devnexes Logo"
                      className="w-11 h-11 sm:w-13 sm:h-13 object-contain shrink-0 mt-0.5"
                    />

                    <div className="flex-1">
                      <h3 className="text-[#061632] text-lg sm:text-xl font-bold font-outfit tracking-tight mb-1.5">
                        We Value Your Privacy
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm md:text-[15px] leading-relaxed font-normal">
                        We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and deliver personalized digital solutions. You can customize your preferences below.
                        {' '}
                        <Link 
                          to="/policy" 
                          className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors ml-1"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Expandable Preferences / Toggle Switches Section */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 pt-5 pb-2 mb-5 space-y-3">
                          {cookieTypes.map((cookie) => (
                            <div 
                              key={cookie.key}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                preferences[cookie.key] 
                                  ? 'bg-blue-50/60 border-blue-200' 
                                  : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[#061632] font-bold text-sm font-outfit">{cookie.label}</span>
                                  {cookie.locked && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                                      Required
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed">{cookie.description}</p>
                              </div>
                              
                              {/* Toggle Switch */}
                              <button
                                onClick={() => togglePreference(cookie.key)}
                                disabled={cookie.locked}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                                  preferences[cookie.key] 
                                    ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                                    : 'bg-slate-300'
                                } ${cookie.locked ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                              >
                                <motion.div
                                  animate={{ x: preferences[cookie.key] ? 26 : 2 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  className="absolute top-[2px] w-5 h-5 rounded-full bg-white shadow-sm"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    
                    {/* Customize Accordion Toggle */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center justify-center gap-2 text-slate-600 hover:text-[#061632] text-xs sm:text-sm font-bold font-outfit uppercase tracking-wider transition-colors py-2.5 px-3 rounded-lg hover:bg-slate-100 cursor-pointer self-start sm:self-auto"
                    >
                      <Shield size={15} className="text-blue-600" />
                      <span>{showDetails ? 'Hide Preferences' : 'Customize Preferences'}</span>
                      {showDetails ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                    </button>

                    {/* Right-aligned Buttons */}
                    <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
                      {/* Reject Button */}
                      <button
                        onClick={rejectAll}
                        className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm font-outfit uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Reject All
                      </button>

                      {/* Save Preferences Button (Shown when customize is open) */}
                      {showDetails && (
                        <button
                          onClick={acceptSelected}
                          className="flex-1 sm:flex-none bg-slate-100 hover:bg-blue-50 border border-blue-200 text-blue-700 px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm font-outfit uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Save Choices
                        </button>
                      )}

                      {/* Accept All Button */}
                      <button
                        onClick={acceptAll}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white px-7 py-2.5 rounded-lg font-bold text-xs sm:text-sm font-outfit uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        Accept All
                      </button>
                    </div>

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

// Helper: Reset cookie consent
export const resetCookieConsent = () => {
  localStorage.removeItem(COOKIE_KEY)
  window.location.reload()
}

export default CookieConsent
