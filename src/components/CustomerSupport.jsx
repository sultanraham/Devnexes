import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, HelpCircle, Phone, Globe, Send, X, User as UserIcon, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CustomerSupport = ({ t, user }) => {
  const navigate = useNavigate()
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';
  const chatEndRef = useRef(null)

  // Fetch messages every 3 seconds for live feel (only if logged in and chat open)
  useEffect(() => {
    if (!showChat || !user) return
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages?user_id=${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (err) { console.error(err) }
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [showChat, user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !user) return
    const msg = { sender: 'User', text: input, user_id: user.id }
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(msg)
      })
      if (res.ok) {
        setInput('')
        // Immediate local sync
        const mRes = await fetch(`${API_BASE}/api/messages?user_id=${user.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        const mData = await mRes.json()
        setMessages(mData)
      }
    } catch (err) { console.error(err) }
  }

  const handleFAQScroll = () => {
    const el = document.getElementById('faq-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const supportCards = [
    {
      icon: <HelpCircle className="w-12 h-12 text-[#1e3a8a]" />,
      title: "View FAQ",
      desc: "Find answers to frequently asked technical questions.",
      btnText: "Explore",
      action: handleFAQScroll
    },
    {
      icon: <Phone className="w-12 h-12 text-[#1e3a8a]" />,
      title: "Contact Support",
      desc: "Get in touch with our elite support team for complex queries.",
      btnText: "Connect",
      action: () => navigate('/contact')
    },
    {
      icon: <Globe className="w-12 h-12 text-[#1e3a8a]" />,
      title: "Digital Only",
      desc: "Our exclusive digital-first solutions for global scaling.",
      btnText: "Coming Soon",
      action: () => {}
    }
  ]

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-[#1e3a8a] text-5xl font-medium mb-6 tracking-tighter uppercase">Elite Support Hub</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">We're here to ensure your digital evolution is seamless and high-performing.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all group flex flex-col items-center text-center"
            >
              <div className="mb-8 p-6 bg-slate-50 rounded-3xl group-hover:bg-blue-50 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-[#1e3a8a] text-xl font-medium mb-4 uppercase tracking-tight">{card.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{card.desc}</p>
              <button 
                onClick={card.action}
                className="mt-auto w-full py-4 rounded-2xl bg-slate-50 text-[#1e3a8a] font-medium text-xs uppercase tracking-widest hover:bg-[#1e3a8a] hover:text-white transition-all shadow-sm"
              >
                {card.btnText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col h-[700px]"
            >
              {/* Chat Header */}
              <div className="p-8 bg-[#1e3a8a] text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium uppercase tracking-widest text-sm">Developer Support</h4>
                    <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live Now
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-3 hover:bg-white/10 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages or Login Prompt */}
              {user ? (
                <>
                  <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-slate-50/50">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-5 rounded-[24px] ${msg.sender === 'User' ? 'bg-[#1e3a8a] text-white rounded-tr-none shadow-lg' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                          <span className={`text-[9px] mt-2 block opacity-50 font-medium uppercase ${msg.sender === 'User' ? 'text-white' : 'text-slate-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                        <MessageCircle className="w-12 h-12 mb-4" />
                        <p className="text-xs font-medium uppercase tracking-widest">No conversation yet. Say hello!</p>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={sendMessage} className="p-8 border-t border-slate-100 bg-white">
                    <div className="flex gap-4">
                      <input 
                        type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type your message..." 
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-[#1e3a8a] transition-all font-medium text-slate-800"
                      />
                      <button type="submit" className="bg-[#1e3a8a] text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-all">
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                    <Lock className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-[#1e3a8a] text-2xl font-medium uppercase tracking-tighter mb-4">Secure Channel Locked</h3>
                  <p className="text-slate-400 text-base font-medium mb-12">Please sign in to your elite portal to access live developer support.</p>
                  <button 
                    onClick={() => { setShowChat(false); navigate('/#login-section'); }}
                    className="bg-[#1e3a8a] text-white px-10 py-5 rounded-3xl font-medium text-base shadow-xl shadow-blue-900/10 hover:bg-[#1a4178] transition-all"
                  >
                    IDENTIFY YOURSELF
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
      `}</style>
    </section>
  )
}

export default CustomerSupport
