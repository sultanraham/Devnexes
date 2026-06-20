import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Shield, Zap, Globe, Code } from 'lucide-react'
import Footer from './Footer'

const team = [
  {
    name: 'Muhammad Arham',
    role: 'Chief Operations Officer',
    dept: 'Operations',
    bio: 'Manages project delivery, client operations, and internal processes to ensure consistent quality and on-time results.',
    photo: '/images/devnexes-team-arham.png',
    photoPos: 'center top',
    initials: 'MA',
    accent: '#0369a1',
    gradientFrom: '#0c1a2e',
    gradientTo: '#0369a1',
    linkedin: 'https://www.linkedin.com/in/muhammad-arham-abdul-qayyum-3771b1356/',
  },
  {
    name: 'Huzaifa Ali',
    role: 'Chief Technology Officer',
    dept: 'Tech Leadership',
    bio: 'Oversees all technical architecture, engineering standards, and system infrastructure across every project.',
    photo: '/images/devnexes-team-huzaifa.png',
    photoPos: 'center center',
    initials: 'HA',
    accent: '#1d4ed8',
    gradientFrom: '#0f172a',
    gradientTo: '#1d4ed8',
    linkedin: 'https://linkedin.com/company/devnexes-digital-solutions',
  },
  {
    name: 'Huzaifa Mushtaq',
    role: 'Technical Team Lead',
    dept: 'Engineering',
    bio: 'Leads the engineering team, code reviews, and hands-on development of client projects with precision and expertise.',
    photo: '/images/devnexes-team-huzafa.png',
    photoPos: 'center top',
    initials: 'HM',
    accent: '#2563eb',
    gradientFrom: '#0a1628',
    gradientTo: '#2563eb',
    linkedin: 'https://linkedin.com/company/devnexes-digital-solutions',
  },
  {
    name: 'Muhammad Raham',
    role: 'Founder & Principal Architect',
    dept: 'Executive',
    bio: 'Visionary behind Devnexes. Leads product strategy, client relationships, and company direction with a bold long-term vision.',
    photo: '/images/devnexes-team-raham.png',
    photoPos: 'center top',
    initials: 'MR',
    accent: '#1e3a8a',
    gradientFrom: '#061632',
    gradientTo: '#1e3a8a',
    linkedin: 'https://linkedin.com/company/devnexes-digital-solutions',
  }
]

const values = [
  { icon: <Shield className="w-6 h-6" />, title: 'Security First', desc: 'Every system we build is designed with security as a foundation, not an afterthought.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Speed & Quality', desc: 'We deliver fast without cutting corners — backed by our 1-week post-launch guarantee.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Global Standards', desc: 'We build to international standards while understanding local Pakistani market needs.' },
  { icon: <Code className="w-6 h-6" />, title: 'Clean Engineering', desc: 'Maintainable, documented, and scalable code that your team can understand and grow.' }
]

const TeamCard = ({ member, index }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden cursor-default"
      style={{ borderRadius: 0 }}
    >
      {/* Photo container */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4', maxHeight: 380 }}>
        {/* Photo */}
        <img
          src={member.photo}
          alt={`Devnexes Digital Solutions team member ${member.name} - ${member.role}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ objectPosition: member.photoPos || 'center top' }}
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        {/* Fallback initials */}
        <div
          className="absolute inset-0 items-center justify-center text-white text-5xl font-black tracking-tight"
          style={{ display: 'none', background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})` }}
        >
          {member.initials}
        </div>

        {/* Gradient overlay always visible at bottom */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${member.gradientFrom}f0 0%, ${member.gradientFrom}80 40%, transparent 70%)`,
          }}
        />

        {/* Department badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-white text-[9px] font-black uppercase tracking-[0.35em] px-3 py-1.5 backdrop-blur-sm"
            style={{ background: `${member.accent}cc`, letterSpacing: '0.3em' }}
          >
            {member.dept}
          </span>
        </div>

        {/* Name & Role pinned to bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-xl font-bold tracking-tight leading-none mb-1">
            {member.name}
          </h3>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
            {member.role}
          </p>
        </div>
      </div>

      {/* Info panel below photo */}
      <div
        className="relative p-6 transition-all duration-500"
        style={{ background: 'white', borderTop: `3px solid ${member.accent}` }}
      >
        <p className="text-gray-500 text-sm leading-relaxed mb-5">
          {member.bio}
        </p>

        {/* LinkedIn link */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:gap-3"
          style={{ color: member.accent }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          Connect on LinkedIn
        </a>

        {/* Animated bottom border on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ background: `linear-gradient(to right, ${member.accent}, transparent)` }}
          initial={{ width: 0 }}
          animate={{ width: hovered ? '100%' : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

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

      {/* ── PREMIUM TEAM SECTION ─────────────────────────────────── */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(30,58,138,0.04) 0%, transparent 60%), radial-gradient(circle at 90% 20%, rgba(37,99,235,0.03) 0%, transparent 50%)'
        }} />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="text-center">
              <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-3">The People</p>
              <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter mb-4">Meet the Team</h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto">
                A small, focused team with deep technical expertise and a commitment to delivering results.
              </p>
            </div>

            {/* Decorative line */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="w-2 h-2 bg-[#1e3a8a] rotate-45" />
              <div className="h-px w-24 bg-[#1e3a8a]" />
            </div>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-100 shadow-2xl shadow-slate-100/80">
            {team.map((member, i) => (
              <div
                key={i}
                className={`${i < team.length - 1 ? 'border-r border-slate-100' : ''}`}
              >
                <TeamCard member={member} index={i} />
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {team.map((m, i) => {
                    // Safe fallback: use React state instead of innerHTML
                    const [imgErr, setImgErr] = React.useState(false)
                    return (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white text-[10px] font-black"
                        style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.accent})`, zIndex: team.length - i }}
                      >
                        {imgErr ? (
                          <span>{m.initials}</span>
                        ) : (
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top"
                            onError={() => setImgErr(true)} />
                        )}
                      </div>
                    )
                  })}
              </div>
              <p className="text-[#061632] text-sm font-bold tracking-tight">
                4 experts. One unified mission.
              </p>
            </div>

            <a
              href="https://linkedin.com/company/devnexes-digital-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-6 py-3 font-bold text-[12px] uppercase tracking-widest hover:bg-[#0a66c2]/90 transition-all group"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              Follow Us on LinkedIn
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
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
