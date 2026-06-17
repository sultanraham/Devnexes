import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowLeft, ChevronDown, Shield, ArrowRight } from 'lucide-react'
import Footer from './Footer'

const ContactSection = ({ t }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', type: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  if (!t) return null

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, type: formData.type, message: formData.message })
      })
      const data = await res.json()
      setStatus(data.success ? 'success' : 'error')
      if (data.success) setFormData({ name: '', email: '', type: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="w-full bg-[#f8faff]">
      <section className="min-h-[90vh] w-full relative overflow-x-hidden selection:bg-blue-100 flex flex-col justify-center py-20 md:py-32">
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

            <div className="w-full lg:w-5/12 flex flex-col gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-gray-900 text-3xl md:text-5xl font-bold font-outfit tracking-tighter leading-none mb-4">Let's Connect.</h1>
                <p className="text-gray-500 text-[13px] md:text-[14px] font-outfit uppercase tracking-[0.3em]">Excellence in AI Integration</p>
              </motion.div>

              {[
                { icon: <Mail size={16} />, label: 'Direct Email', val: 'devnexes.support@gmail.com', desc: 'Response within 2 hours.' },
                { icon: <Phone size={16} />, label: 'Phone & WhatsApp', val: '+92 303 0111550', desc: 'Mon-Fri 9am to 6pm PKT.' },
                { icon: <Shield size={16} />, label: 'Security', val: 'AES-256 Encrypted', desc: 'Your data is safe with us.' }
              ].map((item, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="group flex items-start gap-5 p-2 transition-all cursor-default"
                >
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-blue-100 bg-white group-hover:bg-blue-50 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <h4 className="text-gray-900 font-bold font-outfit text-[15px]">{item.val}</h4>
                    <p className="text-gray-400 text-[11px] font-outfit mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="w-full lg:w-7/12 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
                className="bg-white/40 backdrop-blur-lg p-8 md:p-14 shadow-[0_50px_100px_rgba(30,58,138,0.05)] rounded-none relative overflow-hidden"
              >
                <div className="relative z-10">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-14">
                    <h3 className="text-gray-900 text-3xl font-bold font-outfit mb-3 tracking-tight">Request a Consultation</h3>
                    <div className="w-12 h-1 bg-[#1e3a8a] mb-4" />
                    <p className="text-gray-400 text-[13px] md:text-[14px] font-outfit">Fill out the brief below and our architects will reach out.</p>
                  </motion.div>

                  {status === 'success' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                        <ArrowRight className="text-emerald-600 w-8 h-8" />
                      </div>
                      <h4 className="text-gray-900 text-2xl font-bold font-outfit mb-3">Request Sent</h4>
                      <p className="text-gray-400 text-sm font-outfit">We'll respond within 2 hours.</p>
                      <button onClick={() => setStatus(null)} className="mt-8 text-[#1e3a8a] text-xs font-bold uppercase tracking-widest hover:underline">Send Another</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                          <input
                            type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} required
                            className="peer w-full bg-white/20 border-b border-gray-200 px-0 py-4 text-gray-900 focus:outline-none focus:border-[#1e3a8a] transition-all font-outfit text-[14px] rounded-none placeholder-transparent"
                          />
                          <label className="absolute left-0 top-4 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold not-placeholder-shown:-top-4 not-placeholder-shown:text-[10px]">Your Full Name</label>
                        </div>
                        <div className="relative group">
                          <input
                            type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required
                            className="peer w-full bg-white/20 border-b border-gray-200 px-0 py-4 text-gray-900 focus:outline-none focus:border-[#1e3a8a] transition-all font-outfit text-[14px] rounded-none placeholder-transparent"
                          />
                          <label className="absolute left-0 top-4 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold not-placeholder-shown:-top-4 not-placeholder-shown:text-[10px]">Business Email</label>
                        </div>
                      </div>

                      <div className="relative group">
                        <select name="type" value={formData.type} onChange={handleChange} className="peer w-full bg-transparent border-b border-gray-200 px-0 py-4 text-gray-900 focus:outline-none focus:border-[#1e3a8a] transition-all font-outfit text-[14px] rounded-none appearance-none cursor-pointer">
                          <option value="">Project Inquiry Type</option>
                          <option value="web">Web Development & Design</option>
                          <option value="ai">AI System Integration</option>
                          <option value="mobile">Mobile Application</option>
                          <option value="consult">Strategic Consultation</option>
                        </select>
                        <div className="absolute right-0 top-5 pointer-events-none text-gray-400"><ChevronDown size={18} /></div>
                      </div>

                      <div className="relative group">
                        <textarea
                          name="message" placeholder=" " rows="3" value={formData.message} onChange={handleChange} required
                          className="peer w-full bg-transparent border-b border-gray-200 px-0 py-4 text-gray-900 focus:outline-none focus:border-[#1e3a8a] transition-all font-outfit text-[14px] rounded-none resize-none placeholder-transparent"
                        />
                        <label className="absolute left-0 top-4 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold not-placeholder-shown:-top-4 not-placeholder-shown:text-[10px]">Project Goals</label>
                      </div>

                      {status === 'error' && <p className="text-red-400 text-xs font-bold">Something went wrong. Please try again.</p>}

                      <motion.button
                        type="submit" disabled={status === 'sending'}
                        whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#1e3a8a] hover:bg-blue-600 text-white py-5 rounded-none font-bold text-[14px] flex items-center justify-center gap-3 transition-all shadow-xl group tracking-widest uppercase disabled:opacity-60"
                      >
                        <span>{status === 'sending' ? 'Sending...' : 'Submit Request'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest mt-10">Response time: &lt; 24 Hours</p>
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
