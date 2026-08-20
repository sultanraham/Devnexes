import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Shield, Zap, Globe, Code } from 'lucide-react'
import Footer from './Footer'
import SEO from './SEO'
import { team } from '../data/team'

const values = [
  { icon: <Shield className="w-6 h-6" />, title: 'Security First', desc: 'Every system we build is designed with security as a foundation, not an afterthought.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Speed & Quality', desc: 'We deliver fast without cutting corners — backed by our 1-week post-launch guarantee.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Global Standards', desc: 'We build to international standards while understanding local Pakistani market needs.' },
  { icon: <Code className="w-6 h-6" />, title: 'Clean Engineering', desc: 'Maintainable, documented, and scalable code that your team can understand and grow.' }
]

const TeamCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group flex flex-col sm:flex-row bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 gap-8 items-center sm:items-start"
    >
      {/* Photo */}
      <Link to={`/team/${member.slug}`} className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-full overflow-hidden relative border border-slate-100 shadow-sm group-hover:shadow-lg transition-all duration-500 block">
        <img
          src={member.photo}
          alt={`${member.name} - ${member.role} at Devnexes`}
          title={`${member.name} - Devnexes ${member.role}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-[#061632]/0 group-hover:bg-[#061632]/10 transition-colors duration-500" />
        
        {/* Role Badge on Image */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="bg-[#061632]/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg border border-white/20 whitespace-nowrap">
            Devnexes {
              member.role.includes('CEO') ? 'CEO' : 
              member.role.includes('Operations') ? 'COO' : 
              member.role.includes('Technology') ? 'CTO' : 
              member.role.includes('VP') ? 'VP' : 
              member.role.includes('AI') ? 'CAIO' : member.role
            }
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 h-full justify-center w-full sm:w-auto text-center sm:text-left">
        <span className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">{member.dept}</span>
        <Link to={`/team/${member.slug}`} className="hover:text-blue-600 transition-colors">
          <h3 className="text-[#061632] text-2xl sm:text-3xl font-bold tracking-tighter mb-1 hover:text-blue-600 transition-colors">{member.name}</h3>
        </Link>
        <p className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-4">{member.role}</p>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {member.bio}
        </p>

        <div className="mt-auto flex justify-center sm:justify-start">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-6 py-3 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#0a66c2]/90 hover:shadow-lg hover:shadow-[#0a66c2]/30 transition-all group/btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            Connect on LinkedIn
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

const OrganizationChart = () => {
  const ceo = team.find(m => m.slug === 'muhammad-raham-abdul-qayyum')
  const coo = team.find(m => m.slug === 'muhammad-arham-abdul-qayyum')
  const cto = team.find(m => m.slug === 'huzaifa-ali')
  const lead = team.find(m => m.slug === 'huzaifa-mushtaq')
  const caio = team.find(m => m.slug === 'muhammad-habeel')

  const NodeCard = ({ member, gradient = false }) => {
    if (!member) return null;
    return (
      <Link to={`/team/${member.slug}`} className="block">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          className={`relative flex items-center gap-4 p-4 rounded-[20px] border transition-all duration-300 w-72 z-10 cursor-pointer ${
            gradient 
              ? 'bg-gradient-to-br from-[#061632] via-[#0f2756] to-[#1e3a8a] border-white/10 shadow-xl shadow-blue-900/30 text-white' 
              : 'bg-white/90 backdrop-blur-md border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-300'
          }`}
        >
          <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 shadow-inner ${gradient ? 'border-white/20' : 'border-white'}`}>
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" style={{ objectPosition: member.photoPos || 'center top' }} />
          </div>
          <div className="text-left flex-1">
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${gradient ? 'text-blue-300' : 'text-blue-600'}`}>
              {member.role.includes('—') ? member.role.split('—')[1].trim() : (member.role.includes('CEO') ? 'Founder & CEO' : member.role)}
            </p>
            <h4 className={`font-bold text-[15px] tracking-tight leading-tight ${gradient ? 'text-white' : 'text-[#061632]'}`}>
              {member.name}
            </h4>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <div className="w-full flex justify-center py-16 mb-10 overflow-x-auto hide-scrollbar">
      <div className="min-w-[1100px] flex flex-col items-center px-4 relative">
        
        {/* CEO Level */}
        <div className="flex flex-col items-center relative z-20">
          <div className="absolute -inset-8 bg-blue-600/10 blur-3xl rounded-full z-0 pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <NodeCard member={ceo} gradient={true} />
          </motion.div>
          {/* Vertical line down from CEO */}
          <div className="relative w-[2px] h-12 bg-gradient-to-b from-[#1e3a8a] to-blue-200">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1e3a8a] shadow-[0_0_8px_#1e3a8a]" />
          </div>
        </div>

        {/* Second Level Container */}
        <div className="relative flex justify-center gap-12 w-full z-10">
          {/* Horizontal connection line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[672px] h-[2px] bg-blue-200">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
          </div>

          {/* COO Branch */}
          <div className="flex flex-col items-center w-72">
            <div className="w-[2px] h-8 bg-blue-200" />
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <NodeCard member={coo} />
            </motion.div>
          </div>

          {/* CAIO Branch */}
          <div className="flex flex-col items-center w-72">
            <div className="w-[2px] h-8 bg-blue-200" />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <NodeCard member={caio} />
            </motion.div>
          </div>

          {/* CTO Branch */}
          <div className="flex flex-col items-center w-72">
            <div className="w-[2px] h-8 bg-blue-200" />
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <NodeCard member={cto} />
            </motion.div>
            
            {/* Line down to Tech Lead */}
            <div className="relative w-[2px] h-12 bg-gradient-to-b from-blue-200 to-indigo-300">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#818cf8]" />
            </div>
            
            {/* Tech Lead */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
              <NodeCard member={lead} />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}

const AboutPage = ({ t = {} }) => {
  const navigate = useNavigate()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Devnexes Digital Solutions",
    "url": "https://www.devnexes.site/",
    "logo": "https://www.devnexes.site/images/devnexes-logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/devnexes-digital-solutions",
      "https://www.instagram.com/devnexes.digital.solutions/"
    ],
    "founder": {
      "@type": "Person",
      "name": "Muhammad Raham Abdul Qayyum",
      "jobTitle": "Founder & CEO",
      "image": "https://www.devnexes.site/images/team/muhammad-raham-abdul-qayyum-founder-ceo-devnexes.png",
      "url": "https://www.devnexes.site/team/muhammad-raham-abdul-qayyum",
      "sameAs": [
        "https://www.linkedin.com/in/muhammad-raham-abdul-qayyum-850a41396/"
      ]
    },
    "employee": team.filter(m => m.slug !== 'muhammad-raham-abdul-qayyum').map(member => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.role,
      "image": `https://www.devnexes.site${member.photo}`,
      "url": `https://www.devnexes.site/team/${member.slug}`,
      "sameAs": [member.linkedin]
    }))
  };

  return (
    <div className="w-full bg-slate-50 font-outfit relative">
      <SEO 
        title="About Us — Leadership & Vision" 
        description="Learn about Devnexes Digital Solutions, our mission, core values, and the leadership team driving innovation in custom web and AI solutions." 
        keywords="Devnexes team, software company Lahore, Raham Abdul Qayyum, Arham Abdul Qayyum, Huzaifa Ali, Huzaifa Mushtaq, Habeel"
        url="https://www.devnexes.site/about"
        breadcrumbs={[{ name: 'About Us', item: '/about' }]}
      />
      {/* SEO Structured Data for Google Images */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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
      <section className="min-h-[85vh] bg-gradient-to-b from-[#0b2447] via-[#091b3a] to-[#061632] flex items-center justify-center relative overflow-hidden">

        {/* Ambient Radial Glow behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[650px] h-[650px] bg-blue-500/20 rounded-full blur-[160px]" />
        </div>

        {/* Full Visible Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 p-8">
          <img
            src="/images/devnexes-logo.png"
            alt="Devnexes Brand Mark"
            className="w-[85%] sm:w-[60%] md:w-[45%] max-w-[580px] max-h-[75%] opacity-35 filter brightness-150 drop-shadow-[0_0_70px_rgba(59,130,246,0.4)] object-contain"
          />
        </div>

        <div className="absolute inset-0 opacity-[0.04] z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] z-0" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-52 md:pt-64 pb-32 md:pb-40 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
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

      {/* Company Identity / Our Story */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col text-left">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-5 border border-blue-200/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {t.storyTag || 'Our Story'}
              </span>

              <h2 className="text-[#061632] text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight whitespace-pre-line">
                {t.storyTitle || 'Built in Pakistan.\nBuilt for the World.'}
              </h2>
              
              <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
                <p>{t.story1 || 'Devnexes was founded with a single conviction: that businesses in Pakistan and globally deserve access to world-class digital solutions without the inflated agency pricing.'}</p>
                <p>{t.story2 || 'We specialise in AI integration, full-stack web development, and mobile applications. Every project we take on is treated as a long-term partnership, not a transaction.'}</p>
                <p dangerouslySetInnerHTML={{ __html: (t.story3 || 'Our team is fully remote, technically rigorous, and obsessed with delivery quality. We back every project with a 1-week post-launch guarantee. If anything goes wrong after we deliver, we fix it free.').replace('1-week post-launch guarantee', '<strong class="text-blue-900 font-extrabold underline decoration-blue-300">1-week post-launch guarantee</strong>').replace('1 ہفتے کی گارنٹی', '<strong class="text-blue-900 font-extrabold underline decoration-blue-300">1 ہفتے کی گارنٹی</strong>').replace('بضمان لمدة أسبوع واحد بعد الإطلاق', '<strong class="text-blue-900 font-extrabold underline decoration-blue-300">بضمان لمدة أسبوع واحد بعد الإطلاق</strong>') }} />
              </div>

              <div className="mt-10 flex flex-col sm:flex-row justify-start gap-4">
                <button 
                  onClick={() => navigate('/contact')} 
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] cursor-pointer"
                >
                  <span>{t.startProject || 'Start a Project'}</span>
                  <ArrowRight size={16} />
                </button>

                <button 
                  onClick={() => navigate('/portfolio')} 
                  className="flex items-center justify-center gap-2 border border-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span>{t.viewWork || 'View Our Work'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values (Ultra-Modern Glassmorphic Redesign) */}
      <section className="py-28 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 border-y border-slate-200/80 relative overflow-hidden">
        {/* Background Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-20 flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 text-[11px] font-extrabold uppercase tracking-[0.3em] px-4.5 py-1.5 rounded-full mb-4 border border-blue-300/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              What Drives Us
            </span>
            <h2 className="text-[#061632] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl font-medium">
              Built on uncompromising principles of security, speed, global engineering standards, and long-term partnership.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.12, duration: 0.5 }} 
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/15 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Background Ambient Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Top Header Row with Index Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-tr from-[#061632] to-[#1e3a8a] text-cyan-400 group-hover:text-white group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-950/20 group-hover:scale-110">
                      {v.icon}
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full font-mono tracking-widest">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Expandable Accent Line */}
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-5 group-hover:w-full transition-all duration-500 ease-out" />

                  {/* Title & Description */}
                  <h3 className="text-[#061632] font-black text-xl md:text-2xl mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                    {v.desc}
                  </p>
                </div>
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
              <h2 className="text-[#061632] text-3xl md:text-5xl font-bold tracking-tighter mb-4">Leadership Team</h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto">
                Meet the people leading Devnexes Digital Solutions with strategy, technology, operations, and project execution.
              </p>
            </div>

            {/* Decorative line */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="w-2 h-2 bg-[#1e3a8a] rotate-45" />
              <div className="h-px w-24 bg-[#1e3a8a]" />
            </div>
          </motion.div>

          <OrganizationChart />

          {/* Team Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <TeamCard key={i} member={member} index={i} />
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
                5 experts. One unified mission.
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
