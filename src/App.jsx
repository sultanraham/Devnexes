import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import LoginSection from './components/LoginSection'
import DigitalGrowth from './components/DigitalGrowth'
import TrustedClients from './components/TrustedClients'
import VideoSection from './components/VideoSection'
import DownloadSection from './components/DownloadSection'
import FAQSection from './components/FAQSection'
import CustomerSupport from './components/CustomerSupport'
import ContactSection from './components/ContactSection'
import AdminPortal from './components/AdminPortal'
import AboutPage from './components/AboutPage'
import PortfolioPage from './components/PortfolioPage'
import PolicyPage from './components/PolicyPage'
import TeamMemberPage from './components/TeamMemberPage'
import Footer from './components/Footer'
import { translations } from './translations'

const Home = ({ t, onLogin, user }) => (
  <>
    <Hero t={t.hero} />
    <Features t={t.features} />
    {!user && <div id="login-section"><LoginSection t={t.login} onLogin={onLogin} /></div>}
    <DigitalGrowth t={t.growth} />
    <TrustedClients t={t.clients} />
    <VideoSection t={t.features} />
    <DownloadSection t={t.download} />
    <FAQSection t={t.faq} />
    <CustomerSupport t={t.support} user={user} />
    <Footer t={t.hero} />
    {/* WhatsApp float */}
    <a href="https://wa.me/923030111550" target="_blank" rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-emerald-500 hover:bg-emerald-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/30 transition-all hover:scale-110"
      title="Chat on WhatsApp">
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  </>
)

// Route guard: requires a valid token stored in localStorage
const ProtectedRoute = ({ user, role, children }) => {
  const token = localStorage.getItem('token')
  if (!token || !user) return <Navigate to="/#login-section" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

const Layout = ({ currentLang, setCurrentLang, t }) => {
  const location = useLocation()
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      if (!saved || saved === 'undefined') return null
      const parsed = JSON.parse(saved)
      // Basic sanity check to prevent poisoned localStorage from crashing the app
      if (!parsed || typeof parsed !== 'object' || !parsed.id || !parsed.username) return null
      return parsed
    } catch { 
      localStorage.removeItem('user')
      return null 
    }
  })

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  // Session Heartbeat for ALL Visitors
  useEffect(() => {
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId || !/^[a-zA-Z0-9_-]{8,128}$/.test(visitorId)) {
      // Use crypto.randomUUID if available (more secure than Math.random)
      visitorId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? 'g_' + crypto.randomUUID().replace(/-/g, '').slice(0, 20)
        : 'guest_' + Math.random().toString(36).slice(2, 11)
      localStorage.setItem('visitor_id', visitorId)
    }

    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '');
    const sendHeartbeat = () => {
      const username = user ? user.username : 'Anonymous'
      fetch(`${API_BASE}/api/session/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: visitorId, username })
      }).catch(err => console.error('Heartbeat failed:', err))
    }
    
    sendHeartbeat() // Send immediately on load
    const interval = setInterval(sendHeartbeat, 60000) // Every 1 minute
    return () => clearInterval(interval)
  }, [user])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const isFullPage = ['/contact', '/admin', '/about', '/portfolio', '/policy'].includes(location.pathname) || location.pathname.startsWith('/team/')

  return (
    <main className="w-full min-h-screen bg-[#1e4b8b] text-white overflow-x-hidden font-sans">
      {!isFullPage && <Navbar currentLang={currentLang} setCurrentLang={setCurrentLang} user={user} onLogout={logout} />}
      <Routes>
        <Route path="/" element={<Home t={t} onLogin={login} user={user} />} />
        <Route path="/contact" element={<ContactSection t={t.hero} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminPortal onLogout={logout} />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage t={t?.about || {}} />} />
        <Route path="/team/:slug" element={<TeamMemberPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/login" element={<Navigate to="/#login-section" replace />} />
        <Route path="/register" element={<Navigate to="/#register-section" replace />} />
      </Routes>
    </main>
  )
}

function App() {
  const [currentLang, setCurrentLang] = useState('EN')
  const t = translations[currentLang]

  return (
    <Router>
      <Layout currentLang={currentLang} setCurrentLang={setCurrentLang} t={t} />
    </Router>
  )
}

export default App
