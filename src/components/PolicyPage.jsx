import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, RefreshCw, CheckCircle2, Lock, Sparkles, Mail, Phone } from 'lucide-react'
import Footer from './Footer'
import SEO from './SEO'
import { resetCookieConsent } from './CookieConsent'

const tabs = [
  { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
  { id: 'terms', label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
  { id: 'service', label: 'Service & Refund Policy', icon: <RefreshCw className="w-4 h-4" /> }
]

const Section = ({ title, children }) => (
  <div className="mb-10 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
    <h3 className="text-[#061632] font-black text-lg sm:text-xl mb-4 pb-3 border-b border-slate-100 tracking-tight font-outfit flex items-center gap-2">
      {title}
    </h3>
    <div className="text-slate-600 text-sm sm:text-[15px] leading-relaxed space-y-3 font-normal">{children}</div>
  </div>
)

const PolicyPage = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState('privacy')
  const updated = 'August 2025'

  return (
    <div className="w-full bg-slate-50 font-sans min-h-screen">
      <SEO 
        title="Privacy & Service Policies" 
        description="Review Devnexes Digital Solutions' privacy policy, terms & conditions, 1-week post-launch guarantee, and transparent refund policies." 
        keywords="Devnexes privacy policy, terms of service, post launch guarantee, refund policy"
        url="https://www.devnexes.site/policy"
        breadcrumbs={[{ name: 'Policy', item: '/policy' }]}
      />

      {/* Floating Return Button */}
      <div className="fixed top-8 left-8 z-50">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -4 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-[#061632]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg transition-all group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] tracking-[0.2em] uppercase">Return Home</span>
        </motion.button>
      </div>

      {/* Hero Header */}
      <section className="min-h-[45vh] bg-gradient-to-b from-[#0b2447] via-[#091b3a] to-[#061632] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10 pt-36 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-4">
              <Shield className="w-3.5 h-3.5" /> Official Governance &amp; Legal Standard
            </span>
            <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-4 font-outfit">
              Client Protection &amp; Policies
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed">
              Clear commitments, transparent guarantees, and full privacy standards for every Devnexes engagement.
            </p>
            <p className="text-blue-400 text-xs font-semibold mt-4">Last Updated: {updated} — Devnexes Digital Solutions</p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-4 py-2">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  active === tab.id 
                    ? 'bg-[#1e3a8a] text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Details Body */}
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ── PRIVACY POLICY TAB ── */}
          {active === 'privacy' && (
            <>
              <Section title="1. Overview & Commitment">
                <p>
                  Devnexes Digital Solutions ("Devnexes", "we", "us", "our") operates as a high-performance web engineering and AI software agency. We hold client privacy, source code security, and data integrity as paramount priorities across all our client interactions and digital platforms.
                </p>
                <p className="font-semibold text-slate-800">
                  Direct Inquiries: <a href="mailto:devnexes.support@gmail.com" className="text-blue-600 hover:underline">devnexes.support@gmail.com</a> | Phone/WhatsApp: <a href="tel:+923030111550" className="text-blue-600 hover:underline">+92 303 0111550</a>
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <p>We only collect information necessary to deliver, manage, and maintain your software projects:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 font-medium">
                  <li>Contact details: Name, corporate email address, and WhatsApp/phone number.</li>
                  <li>Project scope: Specifications, technical requirements, design wireframes, and support notes.</li>
                  <li>Deployment credentials: Server API keys or hosting access explicitly provided by you for deployment (stored securely during active work).</li>
                  <li>Platform telemetry: Basic browser environment type and anonymized visit metrics for performance optimization.</li>
                </ul>
                <p className="text-xs text-slate-500 italic mt-2">
                  * Note: We never store plain-text passwords or collect financial payment card numbers directly. All payments use official direct bank wires or verified gateways.
                </p>
              </Section>

              <Section title="3. How We Use & Safeguard Your Data">
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 font-medium">
                  <li>To architect, develop, test, and deploy your custom software applications.</li>
                  <li>To provide direct technical support, project status updates, and milestone deliveries.</li>
                  <li>To enforce security protection against unauthorized platform access.</li>
                </ul>
                <p className="mt-3">
                  <strong>Zero Third-Party Data Selling:</strong> Devnexes strictly guarantees that we never sell, rent, trade, or share your contact details, project specifications, or corporate intel with any third-party advertisers or data brokers.
                </p>
              </Section>

              <Section title="4. Technical Data Protection & Security">
                <p>
                  All server infrastructure uses enterprise encryption standards: password hashing via Bcrypt, JWT token authorization, SSL/TLS transport security, and restricted server-only environment variable isolation.
                </p>
              </Section>

              <Section title="5. Cookie Management">
                <p>
                  Our site utilizes minimal privacy-first cookies to remember session state and functional preferences. You can manage or clear your cookie preferences anytime below:
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetCookieConsent}
                    className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Cookie Preferences
                  </button>
                </div>
              </Section>

              <Section title="6. Data Retention & Permanent Deletion Rights">
                <p>
                  You hold full ownership rights over your personal information. You may request a complete record of your stored communications or demand permanent deletion of your account history by contacting us at <a href="mailto:devnexes.support@gmail.com" className="text-blue-600 hover:underline font-bold">devnexes.support@gmail.com</a>. Requests are fulfilled within 5 business days.
                </p>
              </Section>
            </>
          )}

          {/* ── TERMS & CONDITIONS TAB ── */}
          {active === 'terms' && (
            <>
              <Section title="1. Acceptance of Terms">
                <p>
                  By accessing devnexes.site or engaging Devnexes Digital Solutions for software engineering, AI automation, or digital design, you agree to comply with these terms. If you disagree with any clause, please refrain from utilizing our services.
                </p>
              </Section>

              <Section title="2. Engineering Services & Scoping">
                <p>
                  Devnexes provides full-stack web applications, AI autonomous agents, technical SEO optimization, UI/UX prototyping, and dedicated engineering bandwidth. Exact project deliverables, timelines (typically 7–14 days for MVP deliveries), and payment milestones are finalized prior to development start.
                </p>
              </Section>

              <Section title="3. Client Obligations">
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 font-medium">
                  <li>Provide timely project feedback, wireframe approvals, and required credentials.</li>
                  <li>Fulfill milestone payments according to the agreed schedule.</li>
                  <li>Ensure all assets provided (branding, content, text) comply with legal copyright standards.</li>
                </ul>
              </Section>

              <Section title="4. Full Intellectual Property Rights (100% Code Ownership)">
                <p>
                  Upon 100% final payment completion, **all custom source code, repositories, design assets, and database schemas created for your project become your exclusive intellectual property**.
                </p>
                <p>
                  Devnexes retains non-exclusive rights to showcase the completed project in our agency portfolio unless an explicit non-disclosure agreement (NDA) specifies otherwise.
                </p>
              </Section>

              <Section title="5. Strict Non-Disclosure & Confidentiality">
                <p>
                  We treat all proprietary client business logic, trade secrets, database records, and operational code with absolute confidentiality. We will never share your code base or trade secrets with competing entities.
                </p>
              </Section>

              <Section title="6. Limitation of Liability">
                <p>
                  Devnexes is not liable for indirect losses caused by third-party hosting outages, external API provider deprecations, or unauthorized client code modifications executed after project handover. Total liability in any dispute is capped at the total amount paid for the specific milestone in question.
                </p>
              </Section>
            </>
          )}

          {/* ── SERVICE & REFUND POLICY TAB ── */}
          {active === 'service' && (
            <>
              {/* Highlight Guarantee Box */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-2xl mb-10 shadow-xl border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
                  <CheckCircle2 size={16} /> Devnexes Client Trust Commitment
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white font-outfit mb-3">
                  1-Week Post-Launch Guarantee &amp; Free Maintenance
                </h4>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Every software build delivered by Devnexes is backed by our <strong>7-Day Post-Launch Bug-Fix Guarantee</strong> and <strong>1 Free Maintenance Session</strong> (valid for 60 days). We guarantee our code works as promised.
                </p>
              </div>

              <Section title="1. 1-Week Post-Launch Guarantee Details">
                <p>
                  If any feature that was confirmed working during pre-handover demo breaks within <strong>7 calendar days of live launch</strong>, our engineering team will fix it immediately at zero additional charge. This covers:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 font-medium">
                  <li>Critical code bugs or broken frontend/backend logic.</li>
                  <li>Server configuration adjustments or SSL/DNS deployment issues.</li>
                  <li>API integration bugs identified during initial live traffic.</li>
                </ul>
              </Section>

              <Section title="2. Free Maintenance Session (60-Day Window)">
                <p>
                  Your project package includes <strong>1 complimentary post-delivery maintenance session</strong> covering:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700 font-medium">
                  <li>Minor text, copy, or asset updates.</li>
                  <li>Hosting environment tuning &amp; performance checks.</li>
                  <li>Database indexing and SSL renewal validation.</li>
                </ul>
              </Section>

              <Section title="3. Milestone Payment Terms">
                <p>Our standard agency engagement structure:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">Milestone 1</p>
                    <p className="text-slate-800 font-black text-base">50% Initial Deposit</p>
                    <p className="text-slate-500 text-xs mt-1">Required prior to engineering setup and architecture sprint.</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <p className="text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">Milestone 2</p>
                    <p className="text-slate-800 font-black text-base">50% Final Handover</p>
                    <p className="text-slate-500 text-xs mt-1">Paid after completed live staging demo and prior to final source code transfer.</p>
                  </div>
                </div>
              </Section>

              <Section title="4. Transparent Cancellation & Refund Policy">
                <ul className="list-disc list-inside space-y-2 ml-2 text-slate-700 font-medium">
                  <li><strong>Before Development Inception:</strong> 100% full refund of deposit if cancelled prior to sprint kickoff.</li>
                  <li><strong>During Active Development:</strong> Prorated refund evaluated strictly on completed engineering milestones.</li>
                  <li><strong>If We Fail to Deliver:</strong> 100% full refund of all funds paid if Devnexes fails to fulfill agreed milestone specifications.</li>
                  <li><strong>After Final Handover:</strong> Non-refundable once full source code repository is transferred (fully backed by our 7-Day Guarantee).</li>
                </ul>
              </Section>

              <Section title="5. Direct SLA Support Channels">
                <p>For instant technical assistance or policy claims:</p>
                <div className="flex flex-col sm:flex-row gap-4 mt-3">
                  <a 
                    href="https://wa.me/923030111550" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition-all text-xs shadow-md"
                  >
                    <Phone size={16} /> WhatsApp Direct Desk (+92 303 0111550)
                  </a>
                  <a 
                    href="mailto:devnexes.support@gmail.com" 
                    className="flex items-center gap-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl transition-all text-xs shadow-md"
                  >
                    <Mail size={16} /> Email Support (devnexes.support@gmail.com)
                  </a>
                </div>
              </Section>
            </>
          )}

        </motion.div>
      </div>

      <Footer t={{ title: '' }} />
    </div>
  )
}

export default PolicyPage
