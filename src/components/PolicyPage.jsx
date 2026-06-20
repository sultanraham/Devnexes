import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, RefreshCw } from 'lucide-react'
import Footer from './Footer'

const tabs = [
  { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
  { id: 'terms', label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
  { id: 'service', label: 'Service & Refund Policy', icon: <RefreshCw className="w-4 h-4" /> }
]

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h3 className="text-[#061632] font-bold text-lg mb-4 pb-3 border-b border-slate-100 tracking-tight">{title}</h3>
    <div className="text-gray-500 text-[15px] leading-relaxed space-y-3">{children}</div>
  </div>
)

const PolicyPage = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState('privacy')
  const updated = 'June 2025'

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
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-32 md:py-40 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-4">Legal & Policies</p>
            <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tighter leading-none mb-6">Transparency First.</h1>
            <p className="text-white/50 text-base md:text-xl max-w-2xl leading-relaxed">Last updated: {updated} — Devnexes Digital Solutions</p>
          </motion.div>
        </div>
      </section>

      {/* Tab Nav */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActive(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${active === tab.id ? 'border-[#1e3a8a] text-[#1e3a8a]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 max-w-4xl py-20">
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {active === 'privacy' && (
            <>
              <Section title="1. Who We Are">
                <p>Devnexes Digital Solutions ("Devnexes", "we", "us", "our") is a web and AI development company operating from Pakistan. We build digital products and services for clients globally.</p>
                <p>Contact: <a href="mailto:devnexes.support@gmail.com" className="text-[#1e3a8a] hover:underline">devnexes.support@gmail.com</a> | Phone: <a href="tel:+923030111550" className="text-[#1e3a8a] hover:underline">+92 303 0111550</a></p>
              </Section>
              <Section title="2. Information We Collect">
                <p>When you register on our platform or submit a contact form, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Name and email address</li>
                  <li>Username and hashed password (we never store plain-text passwords)</li>
                  <li>Project details and messages you submit</li>
                  <li>Basic usage data (pages visited, browser type)</li>
                </ul>
                <p>We do not collect payment card details directly — payment is handled via bank transfer or agreed payment gateways.</p>
              </Section>
              <Section title="3. How We Use Your Information">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>To deliver and manage your project</li>
                  <li>To communicate project updates and support responses</li>
                  <li>To improve our platform and services</li>
                  <li>To send service-related notifications (never marketing spam)</li>
                </ul>
              </Section>
              <Section title="4. Data Storage & Security">
                <p>All data is stored on secured servers. Passwords are hashed using bcrypt. API access requires JWT authentication. We do not sell, rent, or share your data with third parties.</p>
              </Section>
              <Section title="5. Cookies">
                <p>Our website uses minimal cookies for session management only. We do not use advertising or tracking cookies.</p>
              </Section>
              <Section title="6. Your Rights">
                <p>You may request deletion of your account and data at any time by emailing us at devnexes.support@gmail.com. We will process your request within 7 business days.</p>
              </Section>
              <Section title="7. Changes to This Policy">
                <p>We may update this policy periodically. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
              </Section>
            </>
          )}

          {active === 'terms' && (
            <>
              <Section title="1. Acceptance of Terms">
                <p>By accessing devnexes.site or engaging our services, you agree to these Terms & Conditions. If you disagree, please do not use our services.</p>
              </Section>
              <Section title="2. Services">
                <p>Devnexes provides custom web development, AI integration, mobile application development, and related digital services. Exact deliverables, timelines, and pricing are defined in the project agreement signed before work begins.</p>
              </Section>
              <Section title="3. Client Responsibilities">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide accurate project requirements and feedback in a timely manner</li>
                  <li>Make payments according to the agreed schedule</li>
                  <li>Provide necessary access (domain, hosting, APIs) as required for the project</li>
                  <li>Not use any delivered work for illegal or unethical purposes</li>
                </ul>
              </Section>
              <Section title="4. Intellectual Property">
                <p>Upon full payment, all custom code and assets created for your project transfer to you. Devnexes retains the right to display the project in our portfolio unless you explicitly request otherwise in writing.</p>
                <p>We retain ownership of internal tools, reusable components, and frameworks we develop independently.</p>
              </Section>
              <Section title="5. Confidentiality">
                <p>We treat all client project details, business information, and data as strictly confidential. We will not disclose this information to any third party without your written consent.</p>
              </Section>
              <Section title="6. Limitation of Liability">
                <p>Devnexes is not liable for losses arising from: third-party service outages (hosting, APIs), client-provided incorrect information, or use of delivered work after the project is handed over.</p>
                <p>Our total liability in any dispute is limited to the amount paid for the specific project in question.</p>
              </Section>
              <Section title="7. Governing Law">
                <p>These terms are governed by the laws of Pakistan. Any disputes shall be resolved through mutual negotiation first, and if unresolved, through arbitration in Lahore, Pakistan.</p>
              </Section>
              <Section title="8. Contact">
                <p>For any legal queries: <a href="mailto:devnexes.support@gmail.com" className="text-[#1e3a8a] hover:underline">devnexes.support@gmail.com</a></p>
              </Section>
            </>
          )}

          {active === 'service' && (
            <>
              <div className="bg-emerald-50 border border-emerald-100 p-6 mb-10">
                <p className="text-emerald-700 font-bold text-sm uppercase tracking-widest mb-2">Our Commitment to You</p>
                <p className="text-emerald-600 text-base leading-relaxed">Every project we deliver comes with a <strong>1-week post-launch guarantee</strong> and <strong>1 free maintenance session</strong>. We stand behind our work.</p>
              </div>

              <Section title="1. Project Delivery">
                <p>All projects are delivered according to the agreed scope and timeline. Before delivery, we conduct internal testing and provide a staging environment for your review.</p>
                <p>Final delivery is considered complete when you confirm acceptance or 7 days pass after the final version is shared without feedback.</p>
              </Section>
              <Section title="2. Free Post-Launch Maintenance">
                <p>Every completed project includes <strong>one free maintenance session</strong> which covers:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Bug fixes and error corrections in the delivered code</li>
                  <li>Minor content or text updates</li>
                  <li>Configuration adjustments (hosting, domain, SSL)</li>
                </ul>
                <p>This session must be used within 60 days of project delivery. It does not cover new features or redesigns.</p>
              </Section>
              <Section title="3. 1-Week Post-Launch Guarantee">
                <p>If any functionality that was working at the time of delivery breaks within <strong>7 days of launch</strong>, we will fix it at no additional cost. This applies to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Critical bugs that prevent core functionality from working</li>
                  <li>Server configuration issues caused by our deployment</li>
                  <li>Broken features that were confirmed working during handover</li>
                </ul>
                <p>This guarantee does not cover issues caused by client modifications, third-party API changes, or hosting provider outages.</p>
                <p>To claim: contact us at <a href="tel:+923030111550" className="text-[#1e3a8a] hover:underline">+92 303 0111550</a> or <a href="mailto:devnexes.support@gmail.com" className="text-[#1e3a8a] hover:underline">devnexes.support@gmail.com</a> within 7 days of launch.</p>
              </Section>
              <Section title="4. Payment Terms">
                <p>Standard payment structure:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>50% upfront</strong> before development begins</li>
                  <li><strong>50% on delivery</strong> before final handover</li>
                </ul>
                <p>For larger projects, milestone-based payments can be arranged. All payments are non-refundable once development has begun on that milestone, except as described in section 5.</p>
              </Section>
              <Section title="5. Cancellations & Refunds">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Before work begins:</strong> Full refund of any deposit paid</li>
                  <li><strong>During development:</strong> Partial refund based on work completed — we will provide a breakdown</li>
                  <li><strong>After delivery:</strong> No refund, but the 1-week guarantee and free maintenance apply</li>
                  <li><strong>If we fail to deliver:</strong> Full refund of all payments made</li>
                </ul>
                <p>Refund requests must be submitted in writing to devnexes.support@gmail.com.</p>
              </Section>
              <Section title="6. Ongoing Support & Maintenance Plans">
                <p>Beyond the free maintenance session, we offer monthly retainer plans for ongoing support, updates, and feature additions. Pricing is agreed based on project scope. Contact us to discuss.</p>
              </Section>
              <Section title="7. Contact for Service Issues">
                <p>Phone / WhatsApp: <a href="tel:+923030111550" className="text-[#1e3a8a] font-bold hover:underline">+92 303 0111550</a></p>
                <p>Email: <a href="mailto:devnexes.support@gmail.com" className="text-[#1e3a8a] font-bold hover:underline">devnexes.support@gmail.com</a></p>
                <p>Response time: within 2 hours on business days (Mon–Fri, 9am–6pm PKT)</p>
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
