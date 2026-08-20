import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowLeft, ChevronDown, Shield, ArrowRight } from 'lucide-react'
import Footer from './Footer'
import SEO from './SEO'

// Client-side sanitizer — strips HTML tags, normalizes whitespace
const sanitize = (str, maxLen = 500) =>
  (str || '').toString().trim().replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').slice(0, maxLen)

const ContactSection = ({ t }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error' | 'bot'
  const [honeypot, setHoneypot] = useState('')    // Bot trap — must stay empty
  const formLoadTime = useRef(Date.now())          // Track how long form was on screen

  if (!t) return null

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ── Bot detection ──────────────────────────────────────────
    // 1. Honeypot: real users never fill a hidden field
    if (honeypot !== '') { setStatus('bot'); return }
    // 2. Timing: bots submit instantly; real users take > 2 seconds
    const elapsed = Date.now() - formLoadTime.current
    if (elapsed < 2000) { setStatus('bot'); return }

    // ── Client-side sanitize (defense-in-depth; server also sanitizes) ──
    const safeData = {
      name:    sanitize(formData.name, 100),
      email:   sanitize(formData.email, 100),
      message: sanitize(formData.message, 2000),
    }

    // ── Basic validation ───────────────────────────────────────
    if (!safeData.name || safeData.name.length < 2) { setStatus('error'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeData.email)) { setStatus('error'); return }
    if (!safeData.message || safeData.message.length < 5) { setStatus('error'); return }

    setStatus('sending')
    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(safeData)
      })
      const data = await res.json()
      if (res.status === 429) { setStatus('rate_limited'); return }
      setStatus(data.success ? 'success' : 'error')
      if (data.success) setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="w-full bg-[#f8faff]">
      <SEO 
        title="Contact Us — Request a Consultation" 
        description="Get in touch with Devnexes Digital Solutions. Request a consultation for custom web, mobile, and AI solutions. Expected response time under 2 hours." 
        keywords="contact Devnexes, hire web developer Lahore, AI consultation, software development quote"
        url="https://www.devnexes.site/contact"
        breadcrumbs={[{ name: 'Contact Us', item: '/contact' }]}
      />
      <section className="min-h-[90vh] w-full relative overflow-x-hidden selection:bg-blue-100 flex flex-col justify-center pt-36 md:pt-48 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-[#1e3a8a]/8 rounded-full blur-[140px] mix-blend-multiply" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[160px] mix-blend-multiply" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} />
        </div>

        <div className="fixed top-8 left-8 md:top-12 md:left-12 z-50">
          <motion.button
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: 5 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#1e3a8a] transition-all group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-outfit font-bold text-[9px] md:text-[10px] tracking-[0.3em] uppercase">Return Home</span>
          </motion.button>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 items-center">

            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-[#0a192f] text-4xl md:text-6xl font-black font-outfit tracking-tight leading-tight mb-4">Let's Connect.</h1>
                <p className="text-blue-600 text-sm md:text-base font-bold font-outfit uppercase tracking-[0.2em]">Excellence in AI Integration</p>
              </motion.div>

              <div className="space-y-6">
                {[
                  { icon: <Mail size={20} className="text-blue-600" />, label: 'Direct Email', val: 'devnexes.support@gmail.com', desc: 'Response within 2 hours.' },
                  { icon: <Phone size={20} className="text-blue-600" />, label: 'Phone & WhatsApp', val: '+92 303 0111550', desc: 'Mon-Fri 9am to 6pm PKT.' },
                  { icon: <Shield size={20} className="text-blue-600" />, label: 'Security', val: 'AES-256 Encrypted', desc: 'Your data is safe with us.' }
                ].map((item, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-default border border-transparent hover:border-blue-100"
                  >
                    <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors shadow-inner">
                      {item.icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">{item.label}</p>
                      <h4 className="text-[#0a192f] font-bold font-outfit text-lg leading-none mb-1.5">{item.val}</h4>
                      <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-7/12 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
                className="bg-white p-8 md:p-14 shadow-2xl shadow-blue-900/10 rounded-[40px] border border-blue-50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />
                
                <div className="relative z-10">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-10">
                    <h3 className="text-[#0a192f] text-3xl md:text-4xl font-bold font-outfit mb-4 tracking-tight">Request a Consultation</h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">Fill out the brief below and our technical architects will reach out to you shortly.</p>
                  </motion.div>

                  {status === 'success' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 shadow-lg shadow-emerald-100">
                        <ArrowRight className="text-emerald-500 w-10 h-10" />
                      </div>
                      <h4 className="text-[#0a192f] text-3xl font-bold font-outfit mb-4">Request Sent Successfully</h4>
                      <p className="text-slate-500 text-base font-medium mb-8">We will review your requirements and respond within 2 hours.</p>
                      <button onClick={() => setStatus(null)} className="text-blue-600 bg-blue-50 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">Send Another Request</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* ── Honeypot: hidden from real users, bots fill it ── */}
                      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', tabIndex: -1 }}>
                        <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Your Name</label>
                          <input
                            id="contact-name"
                            type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="80"
                            className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-6 py-4 text-[#0a192f] font-medium text-base outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                          <input
                            id="contact-email"
                            type="email" name="email" value={formData.email} onChange={handleChange} required maxLength="100"
                            className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-6 py-4 text-[#0a192f] font-medium text-base outline-none transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Project Details / Message</label>
                        <textarea
                          id="contact-message"
                          name="message" rows="4" value={formData.message} onChange={handleChange} required maxLength="1000"
                          className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl px-6 py-4 text-[#0a192f] font-medium text-base outline-none transition-all resize-none"
                          placeholder="Tell us about your project requirements..."
                        />
                      </div>

                      <p className="text-slate-400 text-xs font-medium leading-relaxed">
                        By submitting this form, you agree to our{' '}
                        <a href="/policy" className="text-blue-600 hover:underline">Privacy Policy</a>. We never sell your data or send marketing spam.
                      </p>

                      {status === 'error' && <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl">Please check your details and try again.</p>}
                      {status === 'rate_limited' && <p className="text-amber-600 text-sm font-bold bg-amber-50 p-4 rounded-xl border border-amber-200">⏳ Too many messages. Please wait a few minutes and try again.</p>}

                      <motion.button
                        type="submit" disabled={status === 'sending'}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 group tracking-widest uppercase disabled:opacity-60 mt-4"
                      >
                        <span>{status === 'sending' ? 'Transmitting...' : 'Submit Request'}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-6">Expected Response: &lt; 2 Hours</p>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <Footer t={t} />
    </div>
  )
}

export default ContactSection
