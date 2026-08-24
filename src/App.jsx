import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import DigitalGrowth from './components/DigitalGrowth'
import TrustedClients from './components/TrustedClients'
import FAQSection from './components/FAQSection'
import CustomerSupport from './components/CustomerSupport'
import ContactSection from './components/ContactSection'
import AboutPage from './components/AboutPage'
import PortfolioPage from './components/PortfolioPage'
import PolicyPage from './components/PolicyPage'
import TeamMemberPage from './components/TeamMemberPage'
import Footer from './components/Footer'
import SEO from './components/SEO'
import CookieConsent from './components/CookieConsent'
import AIChatbotWidget from './components/AIChatbotWidget'
import Preloader from './components/Preloader'
import { translations } from './translations'

const Home = ({ t }) => (
  <>
    <SEO 
      title="Web Development, AI Automation & SEO Solutions"
      description="Devnexes Digital Solutions builds custom web applications, AI chatbots, automation workflows, and high-ranking SEO strategies for businesses globally."
      keywords="web development Lahore, AI automation Pakistan, custom software agency, chatbots, React web app, SEO services"
      url="https://www.devnexes.site/"
    />
    <Hero t={t.hero} />
    <Features t={t.features} />
    <DigitalGrowth t={t.growth} />
    <TrustedClients t={t.clients} />
    <FAQSection t={t.faq} />
    <CustomerSupport t={t.support} />
    <Footer t={t.hero} />
  </>
)

const Layout = ({ currentLang, setCurrentLang, t }) => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <main className="w-full min-h-screen bg-[#061632] text-white overflow-x-hidden font-sans">
      <Navbar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <Routes>
        <Route path="/" element={<Home t={t} />} />
        <Route path="/contact" element={<ContactSection t={t.hero} />} />
        <Route path="/about" element={<AboutPage t={t?.about || {}} />} />
        <Route path="/team/:slug" element={<TeamMemberPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Preloader />
      <CookieConsent />
      <AIChatbotWidget />
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
