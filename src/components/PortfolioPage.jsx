import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Globe, Cpu, Smartphone, Code, ExternalLink } from 'lucide-react'
import Footer from './Footer'
import SEO from './SEO'

const categories = ['All', 'AI Agents', 'Developer Tools', 'Productivity']

const projects = [
  {
    id: 1,
    title: 'Get Things Done (GTD)',
    category: 'Productivity',
    desc: 'An AI-powered productivity assistant designed to help you organize tasks, manage time, and execute goals efficiently.',
    tags: ['AI', 'Productivity', 'Task Management'],
    image: '/images/projects/gtd.png',
    icon: <Cpu className="w-6 h-6" />,
    color: 'bg-purple-50',
    accent: 'text-purple-600',
    border: 'border-purple-100',
    link: 'https://gtdai.vercel.app/'
  },
  {
    id: 2,
    title: 'Cortex IDE',
    category: 'Developer Tools',
    desc: 'A next-generation integrated development environment built for seamless coding, AI-assisted debugging, and team collaboration.',
    tags: ['Electron', 'React', 'Code Editor'],
    image: '/images/projects/cortex-ide.png',
    icon: <Code className="w-6 h-6" />,
    color: 'bg-blue-50',
    accent: 'text-blue-600',
    border: 'border-blue-100',
    link: '#'
  },
  {
    id: 3,
    title: 'Interview Cracker',
    category: 'AI Agents',
    desc: 'An intelligent background agent that helps you practice, prepare, and ace technical and behavioral interviews.',
    tags: ['AI Agent', 'Career', 'LLM'],
    image: '/images/projects/interview-cracker.png',
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-emerald-50',
    accent: 'text-emerald-600',
    border: 'border-emerald-100',
    link: 'https://github.com/arhamsolution-me/bg-agent/'
  },
  {
    id: 4,
    title: 'Grey Matter',
    category: 'AI Agents',
    desc: 'A powerful local AI agent running entirely on your machine for maximum privacy, low latency, and secure data handling.',
    tags: ['Local AI', 'Privacy', 'Offline'],
    image: '/images/projects/grey-matter.png',
    icon: <Cpu className="w-6 h-6" />,
    color: 'bg-slate-50',
    accent: 'text-slate-600',
    border: 'border-slate-200',
    link: '#'
  },
  {
    id: 5,
    title: 'Lexibase',
    category: 'Developer Tools',
    desc: 'Chat directly with your database using natural language. Instantly query, visualize, and extract insights without writing SQL.',
    tags: ['Database', 'SQL', 'NLP'],
    image: '/images/projects/lexibase.png',
    icon: <Code className="w-6 h-6" />,
    color: 'bg-indigo-50',
    accent: 'text-indigo-600',
    border: 'border-indigo-100',
    link: 'https://github.com/arhamsolution-me/LexiBase/'
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
      <SEO 
        title="Portfolio & Case Studies — AI & Web Projects" 
        description="Explore our portfolio of cutting-edge AI agents, developer tools, local AI products, and productivity solutions built by Devnexes Digital Solutions." 
        keywords="Devnexes portfolio, AI agents, Get Things Done AI, Cortex IDE, Lexibase, Interview Cracker, Grey Matter"
        url="https://www.devnexes.site/portfolio"
        breadcrumbs={[{ name: 'Portfolio', item: '/portfolio' }]}
      />
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

        {/* Background Logo with Low Opacity */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <img
            src="/images/devnexes-logo.png"
            alt=""
            className="w-[120%] md:w-[80%] max-w-[1000px] opacity-[0.15] object-contain"
          />
        </div>

        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-72 md:pt-96 pb-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
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
                  className={`group bg-white border ${project.border} hover:shadow-xl transition-all overflow-hidden relative flex flex-col`}>
                  <div className="h-48 w-full overflow-hidden">
                    <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className={`${project.color} p-6 flex items-center justify-between`}>
                    <div className={`w-10 h-10 bg-white flex items-center justify-center ${project.accent} shadow-sm`}>
                      {project.icon}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${project.accent} bg-white px-3 py-1`}>{project.category}</span>
                  </div>
                  <div className="p-8 grow flex flex-col">
                    <h3 className="text-[#061632] font-bold text-xl mb-3 tracking-tight">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 grow">{project.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 px-3 py-1 border border-slate-100">{tag}</span>
                      ))}
                    </div>
                    {project.link !== '#' ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest ${project.accent} hover:opacity-80 transition-opacity mt-auto`}>
                        View Project <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-auto`}>
                        Coming Soon
                      </span>
                    )}
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
                { icon: <Globe className="w-5 h-5" />, title: '3D Websites', items: ['Three.js & WebGL', 'Interactive Experiences', 'High-end animations'] },
                { icon: <Code className="w-5 h-5" />, title: 'Custom Web Dev', items: ['React / Next.js', 'Node.js & Python', 'Scalable Architecture'] },
                { icon: <Cpu className="w-5 h-5" />, title: 'Automation', items: ['Workflow automation', 'Scripting & bots', 'API integrations'] },
                { icon: <Smartphone className="w-5 h-5" />, title: 'AI Services', items: ['Custom LLM integration', 'AI Agents', 'Chatbots & NLP'] }
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
