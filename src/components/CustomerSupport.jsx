import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, HelpCircle, Phone, Globe, Send, X, User as UserIcon, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CustomerSupport = () => {
  const navigate = useNavigate()

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
                className="mt-auto w-full py-4 rounded-2xl bg-slate-50 text-[#1e3a8a] font-medium text-xs uppercase tracking-widest hover:bg-[#1e3a8a] hover:text-white transition-all shadow-sm cursor-pointer"
              >
                {card.btnText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerSupport
