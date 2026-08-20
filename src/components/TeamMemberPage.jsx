import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { team } from '../data/team'
import Footer from './Footer'
import SEO from './SEO'

const TeamMemberPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const member = team.find(m => m.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (member) {
      document.title = `${member.name} - ${member.role} at Devnexes Digital Solutions`
    }
  }, [member])

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#061632] mb-4">Profile Not Found</h1>
          <button onClick={() => navigate('/about')} className="text-blue-600 hover:underline">
            Return to About Page
          </button>
        </div>
      </div>
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.role,
    "worksFor": {
      "@type": "Organization",
      "name": "Devnexes Digital Solutions",
      "url": "https://www.devnexes.site/"
    },
    "image": `https://www.devnexes.site${member.photo}`,
    "url": `https://www.devnexes.site/team/${member.slug}`,
    "sameAs": [member.linkedin]
  };

  return (
    <div className="w-full bg-slate-50 font-outfit min-h-screen flex flex-col">
      <SEO 
        title={`${member.name} — ${member.role}`} 
        description={`${member.name} is the ${member.role} at Devnexes Digital Solutions. ${member.bio.slice(0, 150)}...`} 
        image={`https://www.devnexes.site${member.photo}`} 
        url={`https://www.devnexes.site/team/${member.slug}`}
        type="profile"
        keywords={`${member.name}, ${member.role}, Devnexes team, ${member.dept}`}
        breadcrumbs={[
          { name: 'About Us', item: '/about' },
          { name: member.name, item: `/team/${member.slug}` }
        ]}
        jsonLd={structuredData}
      />

      {/* Back nav */}
      <div className="fixed top-8 left-8 z-50">
        <Link
          to="/about"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-all group bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] tracking-[0.3em] uppercase">Return to Team</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section 
        className="relative pt-40 pb-48 px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`
        }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ backgroundColor: member.accent }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 bg-white pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-3xl"
          >
            <span className="text-white/70 text-[12px] font-bold uppercase tracking-[0.4em] mb-4 block">
              {member.dept}
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
              {member.name}
            </h1>
            <h2 className="text-blue-100 text-xl md:text-2xl font-medium mb-10 opacity-90">
              {member.role}
            </h2>
            <div className="flex justify-center md:justify-start">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#0a66c2] px-8 py-4 rounded-full font-bold text-[13px] uppercase tracking-widest hover:bg-blue-50 hover:shadow-2xl hover:shadow-white/20 transition-all group/btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                Connect on LinkedIn
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section Overlapping Hero */}
      <main className="flex-1 container mx-auto px-6 max-w-6xl -mt-32 md:-mt-40 relative z-20 pb-32">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          
          {/* Image Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="w-full md:w-5/12 shrink-0 relative"
          >
            <div className="bg-white p-3 md:p-4 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100/50 backdrop-blur-xl">
              <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 relative group">
                <img
                  src={member.photo}
                  alt={`${member.name}, ${member.role} of Devnexes Digital Solutions`}
                  width="600"
                  height="600"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: member.photoPos || 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061632]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8 text-center bg-white rounded-b-[2.5rem]">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-2">Devnexes Digital Solutions</p>
                <p className="text-[#061632] text-lg font-bold">{member.role}</p>
              </div>
            </div>
          </motion.div>

          {/* Bio Content (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
            className="w-full md:w-7/12 md:pt-40"
          >
            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full transition-all duration-500 group-hover:w-3" style={{ backgroundColor: member.accent }} />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md" style={{ backgroundColor: member.accent }}>
                  {member.initials}
                </div>
                <h3 className="text-3xl font-bold text-[#061632] tracking-tight">About Profile</h3>
              </div>
              
              <div className="prose prose-lg prose-slate max-w-none">
                {member.bio.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-500 leading-relaxed text-[17px] mb-6 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Expertise Area</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-slate-50 text-[#061632] rounded-full text-sm font-semibold border border-slate-100">{member.dept}</span>
                  <span className="px-4 py-2 bg-slate-50 text-[#061632] rounded-full text-sm font-semibold border border-slate-100">Leadership</span>
                  <span className="px-4 py-2 bg-slate-50 text-[#061632] rounded-full text-sm font-semibold border border-slate-100">Strategy</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer t={{ title: '' }} />
    </div>
  )
}

export default TeamMemberPage
