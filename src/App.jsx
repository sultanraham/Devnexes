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
import SEO from './components/SEO'
import CookieConsent, { getCookieConsent } from './components/CookieConsent'
import AIChatbotWidget from './components/AIChatbotWidget'
import { translations } from './translations'

const Home = ({ t, onLogin, user }) => (
  <>
    <SEO 
      title="Web Development, AI Automation & SEO Solutions"
      description="Devnexes Digital Solutions builds custom web applications, AI chatbots, automation workflows, and high-ranking SEO strategies for businesses globally."
      keywords="web development Lahore, AI automation Pakistan, custom software agency, chatbots, React web app, SEO services"
      url="https://www.devnexes.site/"
    />
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

  // Session Heartbeat for ALL Visitors (only if analytics cookies accepted)
  useEffect(() => {
    // Respect cookie consent — only track if analytics cookies were accepted
    if (!getCookieConsent('analytics')) return

    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId || !/^[a-zA-Z0-9_-]{8,128}$/.test(visitorId)) {
      // Use crypto.randomUUID if available (more secure than Math.random)
      visitorId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? 'g_' + crypto.randomUUID().replace(/-/g, '').slice(0, 20)
        : 'guest_' + Math.random().toString(36).slice(2, 11)
      localStorage.setItem('visitor_id', visitorId)
    }

    const API_BASE = import.meta.env.VITE_API_URL || '';
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

  const isAdminPage = location.pathname === '/admin'

  return (
    <main className="w-full min-h-screen bg-[#061632] text-white overflow-x-hidden font-sans">
      {!isAdminPage && <Navbar currentLang={currentLang} setCurrentLang={setCurrentLang} user={user} onLogout={logout} />}
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
      <CookieConsent />
      {!isAdminPage && <AIChatbotWidget />}
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
