import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  MessageSquare, 
  Phone, 
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { INITIAL_GREETING, QUICK_REPLIES } from '../config/chatbotSystemPrompt'

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: INITIAL_GREETING, id: 'init-1' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadData, setLeadData] = useState({ name: '', contact: '', service: 'Custom Web & AI' })
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setHasUnread(false)
    }
  }, [messages, isOpen])

  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '')

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage = { role: 'user', content: textToSend, id: `user-${Date.now()}` }
    const updatedMessages = [...messages, userMessage]
    
    setMessages(updatedMessages)
    if (!customText) setInput('')
    setIsLoading(true)

    // Detect lead trigger intent
    const lower = textToSend.toLowerCase()
    if (lower.includes('quote') || lower.includes('pricing') || lower.includes('start a project') || lower.includes('hire') || lower.includes('contact')) {
      setTimeout(() => setShowLeadForm(true), 1200)
    }

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, id: `bot-${Date.now()}` }
      ])
      
      if (!isOpen) setHasUnread(true)
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm having trouble connecting right now. Feel free to chat with our team directly on WhatsApp (+92 303 0111550) or submit a quote request below!",
          id: `bot-err-${Date.now()}`,
          isFallback: true
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    if (!leadData.name || !leadData.contact || isSubmittingLead) return

    setIsSubmittingLead(true)
    try {
      const res = await fetch(`${API_BASE}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          contact: leadData.contact,
          service: leadData.service,
          note: `Chat session context (${messages.length} messages exchanged)`
        })
      })

      if (res.ok) {
        setLeadSubmitted(true)
        setShowLeadForm(false)
        setMessages(prev => [
          ...prev,
          { 
            role: 'assistant', 
            content: `Thank you ${leadData.name}! 🎉 Our engineering team has received your project details (${leadData.service}). We will reach out to ${leadData.contact} within 2 hours.`,
            id: `lead-ack-${Date.now()}` 
          }
        ])
      }
    } catch (err) {
      console.error('Lead submit error:', err)
    } finally {
      setIsSubmittingLead(false)
    }
  }

  return (
    <>
      {/* ── FLOATING CHAT TRIGGER BUTTON (Clean White Theme) ── */}
      <div className="fixed bottom-24 right-6 z-[990]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-white text-slate-900 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-blue-950/30 border border-slate-200 group hover:bg-slate-50 transition-colors"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X size={26} className="transition-transform rotate-90 duration-200 text-slate-700" />
          ) : (
            <>
              <img 
                src="/images/devnexes-logo.png" 
                alt="Devnexes Logo" 
                className="w-8 h-8 object-contain group-hover:rotate-12 transition-transform duration-300" 
              />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white"></span>
              </span>
            </>
          )}
        </motion.button>

        {hasUnread && !isOpen && (
          <div className="absolute right-16 top-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
            Cortex Mini Ready 👋
          </div>
        )}
      </div>

      {/* ── CHAT MODAL WINDOW (Clean White Background) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[995] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[82vh] bg-white text-slate-900 rounded-3xl shadow-2xl shadow-slate-400/30 border border-slate-200 flex flex-col overflow-hidden font-sans"
          >
            {/* ── HEADER (White Theme - Clean Minimalist) ── */}
            <div className="bg-white px-4 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 flex items-center justify-center">
                    <img src="/images/devnexes-logo.png" alt="Devnexes Logo" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    Cortex Mini
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMessages([{ role: 'assistant', content: INITIAL_GREETING, id: 'init-1' }])
                    setShowLeadForm(false)
                  }}
                  title="Reset conversation"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── MESSAGES LIST (White Canvas) ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/70">
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center shrink-0 ${
                        isUser ? 'bg-blue-600 text-white rounded-lg' : ''
                      }`}
                    >
                      {isUser ? <User size={14} /> : <img src="/images/devnexes-logo.png" alt="Logo" className="w-5 h-5 object-contain" />}
                    </div>

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow-sm'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm font-normal'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.isFallback && (
                        <a
                          href="https://wa.me/923030111550"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg transition-all text-xs"
                        >
                          <Phone size={13} />
                          Chat on WhatsApp (+92 303 0111550)
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Agent Thinking Animation (Bouncing 3-dot sequence) */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <img src="/images/devnexes-logo.png" alt="Logo" className="w-5 h-5 object-contain animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs text-slate-600 font-semibold">
                    <span>Cortex Mini is thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reply Pills */}
              {messages.length === 1 && !isLoading && (
                <div className="pl-9 pt-2 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Suggested Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="text-xs bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 px-3 py-1.5 rounded-full transition-all text-left shadow-xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline Lead Capture Form */}
              {showLeadForm && !leadSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-600" /> Request a Free Consultation
                    </h4>
                    <button onClick={() => setShowLeadForm(false)} className="text-slate-400 hover:text-slate-700">
                      <X size={14} />
                    </button>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={leadData.name}
                      onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                    />
                    <input
                      type="text"
                      placeholder="Email or WhatsApp Number *"
                      required
                      value={leadData.contact}
                      onChange={e => setLeadData({ ...leadData, contact: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                    />
                    <select
                      value={leadData.service}
                      onChange={e => setLeadData({ ...leadData, service: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                    >
                      <option value="Custom Web Applications">Custom Web Applications</option>
                      <option value="AI Automation & Chatbots">AI Automation &amp; Chatbots</option>
                      <option value="SEO & Page Speed">SEO &amp; Page Speed</option>
                      <option value="UI/UX & Interactive Design">UI/UX &amp; Interactive Design</option>
                      <option value="Dedicated Engineering Team">Dedicated Engineering Team</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isSubmittingLead ? 'Submitting...' : 'Submit Consultation Request'}
                    </button>
                  </form>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── FOOTER / INPUT BAR (Clean White) ── */}
            <div className="p-3 bg-white border-t border-slate-200 flex flex-col gap-2 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Devnexes AI anything..."
                  value={input}
                  maxLength={2000}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-slate-100/90 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-0.5 font-medium">
                <span>Powered by Devnexes Digital Solutions</span>
                <a
                  href="https://wa.me/923030111550"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Phone size={10} /> Speak with Human
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
