import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Globe, Cpu, Smartphone, Code, ExternalLink } from 'lucide-react'
import Footer from './Footer'

const categories = ['All', 'Web Dev', 'AI Solutions', 'Mobile', 'E-Commerce']

const projects = [
  {
    id: 1,
    title: 'Edu AI Platform',
    category: 'AI Solutions',
    desc: 'AI-powered learning platform with personalised lesson plans, real-time progress tracking, and adaptive quizzes.',
    tags: ['React', 'Python', 'OpenAI'],
    icon: <Cpu className="w-6 h-6" />,
    color: 'bg-purple-50',
    accent: 'text-purple-600',
    border: 'border-purple-100'
  },
  {
    id: 2,
    title: 'Tourism Discovery App',
    category: 'Mobile',
    desc: 'Full-stack tourism platform with interactive maps, booking integration, and multi-language support for Pakistan travel.',
    tags: ['React Native', 'Node.js', 'Maps API'],
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-emerald-50',
    accent: 'text-emerald-600',
    border: 'border-emerald-100'
  },
  {
    id: 3,
    title: 'Islamic Master App',
    category: 'Mobile',
    desc: 'Comprehensive Islamic companion app with prayer times, Quran reader, Hadith database, and Qibla direction.',
    tags: ['React Native', 'Firebase', 'API'],
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-amber-50',
    accent: 'text-amber-600',
    border: 'border-amber-100'
  },
  {
    id: 4,
    title: 'Database AI Chatbot',
    category: 'AI Solutions',
    desc: 'Natural language interface for business databases — query your data in plain English, get structured results instantly.',
    tags: ['Python', 'LangChain', 'SQL', 'GPT-4'],
    icon: <Cpu className="w-6 h-6" />,
    color: 'bg-indigo-50',
    accent: 'text-indigo-600',
    border: 'border-indigo-100'
  },
  {
    id: 5,
    title: 'Devnexes Client Portal',
    category: 'Web Dev',
    desc: 'Full-stack SaaS client management portal with real-time project tracking, invoicing, and live developer chat.',
    tags: ['React', 'Node.js', 'SQLite', 'JWT'],
    icon: <Code className="w-6 h-6" />,
    color: 'bg-blue-50',
    accent: 'text-blue-600',
    border: 'border-blue-100'
  },
  {
    id: 6,
    title: 'E-Commerce Platform',
    category: 'E-Commerce',
    desc: 'Custom e-commerce solution with inventory management, payment gateway integration, and admin dashboard.',
    tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-rose-50',
    accent: 'text-rose-600',
    border: 'border-rose-100'
  }
]

const clientLogos = [
  { name: 'StartupPK', initials: 'SPK' },
  { name: 'TechVentures', initials: 'TV' },
  { name: 'EduTech Co', initials: 'ET' },
  { name: 'TravelPak', initials: 'TP' },
  { name: 'RetailMax', initials: 'RM' },
  { name: 'FinanceHub', initials: 'FH' }
]

const PortfolioPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All' ? projects : projects.filter(p => p.category === activeFilter)

  return (
    <div className="w-full bg-white font-outfit">

      <div className="fixed top-8 left-8 z-50">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-[#1e3a8a] transition-all group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[9px] md:text-[10px] tracking-[0.3em] uppercase">Return Home</span>
        </motion.button>
      </div>

      {/* Hero */}
      <section className="min-h-[50vh] bg-[#061632] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-32 md:py-40">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">Our Work</p>
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tighter leading-none mb-6 max-w-4xl">
              Projects We're Proud Of.
            </h1>
            <p className="text-white/50 text-base md:text-xl max-w-2xl leading-relaxed">
              A selection of products, platforms, and systems we've built for clients across Pakistan and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300 text-center mb-10">
            Trusted by Growing Businesses
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {clientLogos.map((logo, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#1e3a8a]/30 transition-all">
                  <span className="text-[10px] font-black text-slate-400 tracking-tighter">{logo.initials}</span>
                </div>
                <span className="text-slate-400 font-bold text-sm tracking-tight group-hover:text-[#1e3a8a] transition-all">{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-[#061632] text-3xl md:text-4xl font-bold tracking-tighter">Case Studies</h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${activeFilter === cat ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]' : 'border-slate-200 text-slate-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`group bg-white border ${project.border} hover:shadow-xl transition-all overflow-hidden relative`}>
                  <div className={`${project.color} p-8 flex items-center justify-between`}>
                    <div className={`w-12 h-12 bg-white flex items-center justify-center ${project.accent} shadow-sm`}>
                      {project.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${project.accent} bg-white px-3 py-1`}>{project.category}</span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-[#061632] font-bold text-xl mb-3 tracking-tight">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 px-3 py-1 border border-slate-100">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">What We Build</p>
              <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter mb-6">End-to-End Digital Solutions</h2>
              <p className="text-gray-400 text-base leading-relaxed mb-10">From a landing page to a full SaaS platform — we scope, design, develop, and deliver. Then we stick around for support.</p>
              <button onClick={() => navigate('/contact')} className="flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 font-bold text-[13px] uppercase tracking-widest hover:bg-blue-700 transition-all group">
                Discuss Your Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Code className="w-5 h-5" />, title: 'Web Development', items: ['React / Next.js', 'Node.js backends', 'REST & GraphQL APIs'] },
                { icon: <Cpu className="w-5 h-5" />, title: 'AI Integration', items: ['GPT-4 / Claude', 'Custom ML models', 'Chatbots & agents'] },
                { icon: <Smartphone className="w-5 h-5" />, title: 'Mobile Apps', items: ['React Native', 'iOS & Android', 'App Store publishing'] },
                { icon: <Globe className="w-5 h-5" />, title: 'Cloud & DevOps', items: ['AWS / VPS hosting', 'CI/CD pipelines', 'Domain & SSL setup'] }
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="bg-white border border-slate-100 p-6 hover:border-[#1e3a8a]/20 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-blue-50 flex items-center justify-center text-[#1e3a8a] mb-4">{s.icon}</div>
                  <h4 className="text-[#061632] font-bold text-sm mb-3 uppercase tracking-wide">{s.title}</h4>
                  <ul className="space-y-1">
                    {s.items.map(item => <li key={item} className="text-gray-400 text-xs">{item}</li>)}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#061632]">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tighter mb-4">Want to Be in Here?</h2>
            <p className="text-white/40 text-base mb-10 max-w-xl mx-auto">Let's build your next project together.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => navigate('/contact')} className="flex items-center gap-2 bg-white text-[#1e3a8a] px-8 py-4 font-bold text-[13px] uppercase tracking-widest hover:bg-slate-100 transition-all group">
                Get a Free Quote <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/about')} className="border border-white/20 text-white/60 hover:text-white hover:border-white px-8 py-4 font-bold text-[13px] uppercase tracking-widest transition-all">
                About Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer t={{ title: '' }} />
    </div>
  )
}

export default PortfolioPage
