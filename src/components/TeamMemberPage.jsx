import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { team } from '../data/team'
import Footer from './Footer'

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
    <div className="w-full bg-white font-outfit min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Back nav */}
      <div className="fixed top-8 left-8 z-50">
        <Link
          to="/about"
          className="flex items-center gap-2 text-gray-400 hover:text-[#1e3a8a] transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] tracking-[0.3em] uppercase">Back to Team</span>
        </Link>
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-5xl py-32 md:py-40">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="w-full md:w-5/12 shrink-0"
          >
            <figure className="w-full relative">
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-blue-900/5 mb-6">
                <img
                  src={member.photo}
                  alt={`${member.name}, ${member.role} of Devnexes Digital Solutions`}
                  width="600"
                  height="600"
                  loading="eager"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: member.photoPos || 'center top' }}
                />
              </div>
              <figcaption className="text-center text-slate-500 text-sm font-medium border-l-4 border-blue-600 pl-4 py-1 text-left italic">
                {member.name} — {member.role}, Devnexes Digital Solutions
              </figcaption>
            </figure>
          </motion.div>

          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="w-full md:w-7/12 pt-4"
          >
            <span className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] mb-4 block">
              {member.dept}
            </span>
            <h1 className="text-[#061632] text-4xl md:text-5xl font-bold tracking-tighter mb-2 leading-tight">
              {member.name}
            </h1>
            <h2 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-8">
              {member.role}
            </h2>

            <div className="w-12 h-1 bg-blue-600 mb-8 rounded-full" />

            <div className="prose prose-lg prose-slate max-w-none mb-10 text-gray-500">
              <p className="leading-relaxed">
                {member.bio}
              </p>
            </div>

            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-8 py-4 rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-[#0a66c2]/90 hover:shadow-lg hover:shadow-[#0a66c2]/30 transition-all group/btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              Connect on LinkedIn
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </main>

      <Footer t={{ title: '' }} />
    </div>
  )
}

export default TeamMemberPage
