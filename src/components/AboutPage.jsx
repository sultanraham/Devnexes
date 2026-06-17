import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Shield, Zap, Globe, Award, Users, Code } from 'lucide-react'
import Footer from './Footer'

const team = [
  {
    name: 'Muhammad Raham',
    role: 'Founder & Principal Architect',
    dept: 'Executive',
    bio: 'Visionary behind Devnexes. Leads product strategy, client relationships, and company direction.',
    initials: 'MR',
    color: 'bg-[#1e3a8a]'
  },
  {
    name: 'Muhammad Huzaifa',
    role: 'Chief Technology Officer',
    dept: 'Tech Team',
    bio: 'Oversees all technical architecture, engineering standards, and system infrastructure.',
    initials: 'MH',
    color: 'bg-slate-800'
  },
  {
    name: 'Muhammad Arham',
    role: 'Chief Operations Officer',
    dept: 'Operations',
    bio: 'Manages project delivery, client operations, and internal processes to ensure quality output.',
    initials: 'MA',
    color: 'bg-slate-700'
  },
  {
    name: 'Huzafa Mushtaq',
    role: 'Technical Team Lead',
    dept: 'Engineering',
    bio: 'Leads the engineering team, code reviews, and hands-on development of client projects.',
    initials: 'HM',
    color: 'bg-blue-700'
  }
]

const values = [
  { icon: <Shield className="w-6 h-6" />, title: 'Security First', desc: 'Every system we build is designed with security as a foundation, not an afterthought.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Speed & Quality', desc: 'We deliver fast without cutting corners — backed by our 1-week post-launch guarantee.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Global Standards', desc: 'We build to international standards while understanding local Pakistani market needs.' },
  { icon: <Code className="w-6 h-6" />, title: 'Clean Engineering', desc: 'Maintainable, documented, and scalable code that your team can understand and grow.' }
]

const AboutPage = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-white font-outfit">

      {/* Back nav */}
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
      <section className="min-h-[60vh] bg-[#061632] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-32 md:py-40">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">About Devnexes</p>
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tighter leading-none mb-6 max-w-4xl">
              We Build Digital Products That Work.
            </h1>
            <p className="text-white/50 text-base md:text-xl max-w-2xl leading-relaxed">
              Devnexes is a Pakistani AI and web development company founded to help businesses build reliable, modern, and scalable digital infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Identity */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">Our Story</p>
              <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
                Built in Pakistan.<br />Built for the World.
              </h2>
              <div className="space-y-4 text-gray-500 text-base leading-relaxed">
                <p>
                  Devnexes was founded with a single conviction: that businesses in Pakistan — and globally — deserve access to world-class digital solutions without the inflated agency pricing.
                </p>
                <p>
                  We specialise in AI integration, full-stack web development, and mobile applications. Every project we take on is treated as a long-term partnership, not a transaction.
                </p>
                <p>
                  Our team is fully remote, technically rigorous, and obsessed with delivery quality. We back every project with a <strong className="text-[#1e3a8a]">1-week post-launch guarantee</strong> — if anything goes wrong after we deliver, we fix it free.
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/contact')} className="flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 rounded-none font-bold text-[13px] uppercase tracking-widest hover:bg-blue-700 transition-all group">
                  Start a Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/portfolio')} className="flex items-center justify-center gap-2 border border-slate-200 text-[#1e3a8a] px-8 py-4 rounded-none font-bold text-[13px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                  View Our Work
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
              {[
                { num: '50+', label: 'Projects Delivered' },
                { num: '100%', label: 'Client Retention' },
                { num: '4', label: 'Core Team Members' },
                { num: '1 Wk', label: 'Launch Guarantee' }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="bg-slate-50 border border-slate-100 p-8 flex flex-col">
                  <span className="text-[#1e3a8a] text-4xl font-bold tracking-tighter mb-2">{stat.num}</span>
                  <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-3">What We Stand For</p>
            <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white border border-slate-100 p-8 group hover:border-[#1e3a8a]/20 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-[#1e3a8a] mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                  {v.icon}
                </div>
                <h3 className="text-[#061632] font-bold text-lg mb-3 tracking-tight">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-3">The People</p>
            <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter mb-4">Meet the Team</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">A small, focused team with deep technical expertise and a commitment to delivering results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="group relative bg-white border border-slate-100 hover:border-[#1e3a8a]/20 hover:shadow-xl transition-all overflow-hidden">
                <div className={`${member.color} h-2 w-full`} />
                <div className="p-8">
                  <div className={`w-16 h-16 ${member.color} flex items-center justify-center mb-6`}>
                    <span className="text-white font-bold text-xl tracking-tight">{member.initials}</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-2">{member.dept}</p>
                  <h3 className="text-[#061632] font-bold text-xl tracking-tight mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-[#061632]">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tighter mb-4">Ready to Build Something?</h2>
            <p className="text-white/40 text-base mb-10 max-w-xl mx-auto">Contact us directly — we respond within 2 hours on business days.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="mailto:devnexes.support@gmail.com" className="text-white/60 hover:text-white transition-all text-sm font-medium">devnexes.support@gmail.com</a>
              <span className="text-white/20 hidden sm:block">|</span>
              <a href="tel:+923030111550" className="text-white/60 hover:text-white transition-all text-sm font-medium">+92 303 0111550</a>
              <span className="text-white/20 hidden sm:block">|</span>
              <a href="https://wa.me/923030111550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 font-bold text-[12px] uppercase tracking-widest hover:bg-emerald-500 transition-all">
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer t={{ title: '' }} />
    </div>
  )
}

export default AboutPage
