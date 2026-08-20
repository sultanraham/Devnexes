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
  ChevronDown,
  Settings
} from 'lucide-react'
import { INITIAL_GREETING, QUICK_REPLIES, SYSTEM_PROMPT } from '../config/chatbotSystemPrompt'

const renderFormattedText = (text, isUser) => {
  if (!text) return null
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className={`font-bold ${isUser ? 'text-white underline decoration-white/30' : 'text-slate-900 font-extrabold'}`}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Individual user session cache (cleared automatically on browser refresh)
  const [messages, setMessages] = useState(() => {
    try {
      const navEntry = performance.getEntriesByType('navigation')?.[0]
      const isReload = navEntry && navEntry.type === 'reload'
      if (isReload) {
        sessionStorage.removeItem('devnexes_chat_history')
        return [{ role: 'assistant', content: INITIAL_GREETING, id: 'init-1' }]
      }
      const cached = sessionStorage.getItem('devnexes_chat_history')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {}
    return [{ role: 'assistant', content: INITIAL_GREETING, id: 'init-1' }]
  })

  useEffect(() => {
    try {
      sessionStorage.setItem('devnexes_chat_history', JSON.stringify(messages))
    } catch (e) {}
  }, [messages])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadData, setLeadData] = useState({ name: '', contact: '', service: 'Custom Web Application', note: '' })
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const messagesEndRef = useRef(null)
  const chatModalRef = useRef(null)
  const triggerBtnRef = useRef(null)
  const speedDialRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setHasUnread(false)
    }
  }, [messages, isOpen])

  // Close chatbot modal or menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen && 
        chatModalRef.current && 
        !chatModalRef.current.contains(event.target) &&
        triggerBtnRef.current &&
        !triggerBtnRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }

      if (
        isMenuOpen &&
        speedDialRef.current &&
        !speedDialRef.current.contains(event.target) &&
        triggerBtnRef.current &&
        !triggerBtnRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, isMenuOpen])

  const API_BASE = import.meta.env.VITE_API_URL || ''

  // Real-time typewriter effect helper
  const animateBotResponse = (fullText, botMsgId) => {
    let currentText = ''
    const words = fullText.split(' ')
    let index = 0

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index]
        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, content: currentText } : m)
        )
        index++
      } else {
        clearInterval(interval)
      }
    }, 35) // ~35ms per word for natural fast typing animation
  }

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
    if (
      lower.includes('quote') || 
      lower.includes('pricing') || 
      lower.includes('start a project') || 
      lower.includes('hire') || 
      lower.includes('contact') || 
      lower.includes('form') || 
      lower.includes('consultation')
    ) {
      setTimeout(() => setShowLeadForm(true), 600)
    }

    let replyText = null

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.reply) replyText = data.reply
      }
    } catch (err) {
      console.warn('Backend API error:', err)
    }

    setIsLoading(false)

    if (replyText) {
      const botMsgId = `bot-${Date.now()}`
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '', id: botMsgId }
      ])
      animateBotResponse(replyText, botMsgId)
      if (!isOpen) setHasUnread(true)
    } else {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm having trouble connecting right now. Feel free to chat with our team directly on WhatsApp (+92 303 0111550) or submit a quote request below!",
          id: `bot-err-${Date.now()}`,
          isFallback: true
        }
      ])
    }
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    if (!leadData.name || !leadData.contact || isSubmittingLead) return

    setIsSubmittingLead(true)

    try {
      await fetch(`${API_BASE}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          contact: leadData.contact,
          service: leadData.service,
          note: leadData.note ? leadData.note : `Chat session context (${messages.length} messages exchanged)`
        })
      }).catch(() => {})

      setLeadSubmitted(true)
      setShowLeadForm(false)
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Thank you **${leadData.name}**! 🎉 Our team has received your project quote request for **${leadData.service}**. An email alert has been sent to our engineering desk (**devnexes.support@gmail.com**), and we will reach out to **${leadData.contact}** within 2 hours!`,
          id: `lead-ack-${Date.now()}`
        }
      ])
    } catch (err) {
      console.error('Lead submit error:', err)
    } finally {
      setIsSubmittingLead(false)
    }
  }

  return (
    <>
      {/* ── UNIFIED FLOATING SPEED-DIAL WIDGET ── */}
      <div className="fixed bottom-6 right-6 z-[990] flex flex-col items-end">
        
        {/* Speed-Dial Round Sub-Buttons Menu (No square box!) */}
        <AnimatePresence>
          {isMenuOpen && !isOpen && (
            <motion.div
              ref={speedDialRef}
              initial={{ opacity: 0, y: 15, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.85 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-3 flex flex-col items-end gap-3 z-[992]"
            >
              {/* Choice 1: Cortex Mini AI (Round Sub-Button) */}
              <button
                onClick={() => {
                  setIsOpen(true)
                  setIsMenuOpen(false)
                }}
                className="flex items-center gap-3.5 group cursor-pointer"
              >
                <span className="bg-[#061632] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                  Cortex Mini AI
                </span>
                <div className="w-12 h-12 rounded-full bg-white text-slate-900 border border-slate-200 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-slate-50 transition-all">
                  <img src="/images/devnexes-logo.png" alt="Cortex Mini" className="w-6 h-6 object-contain" />
                </div>
              </button>

              {/* Choice 2: WhatsApp Chat (Round Sub-Button) */}
              <a
                href="https://wa.me/923030111550"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3.5 group cursor-pointer"
              >
                <span className="bg-[#061632] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                  WhatsApp Chat
                </span>
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-emerald-400 transition-all">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button (Vibrant Royal Gradient & Glowing Shadow) */}
        <motion.button
          ref={triggerBtnRef}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false)
              setIsMenuOpen(false)
            } else {
              setIsMenuOpen(!isMenuOpen)
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.5)] border-2 border-white/40 group transition-all cursor-pointer"
          aria-label="Open Devnexes Tools Menu"
        >
          {isOpen || isMenuOpen ? (
            <X size={26} className="transition-transform rotate-90 duration-200 text-white" />
          ) : (
            <>
              <Settings className="w-7 h-7 text-white group-hover:rotate-180 transition-transform duration-700 ease-in-out drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </motion.button>

        {hasUnread && !isOpen && !isMenuOpen && (
          <div className="absolute right-16 top-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
            Cortex Mini Ready 👋
          </div>
        )}
      </div>

      {/* ── CHAT MODAL WINDOW (Clean Flat White) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatModalRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[995] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[82vh] bg-white text-slate-900 rounded-3xl shadow-2xl shadow-slate-400/30 border border-slate-200 flex flex-col overflow-hidden font-sans"
          >
            {/* ── HEADER (Flat White Minimalist) ── */}
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

            {/* ── MESSAGES LIST (Clean Flat Canvas) ── */}
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
                          ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none font-normal'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{renderFormattedText(msg.content, isUser)}</p>
                      
                      {msg.whatsappUrl && (
                        <a
                          href={msg.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl transition-all text-xs shadow-md"
                        >
                          <Phone size={13} />
                          Send Quote Request via WhatsApp
                        </a>
                      )}

                      {msg.isFallback && !msg.whatsappUrl && (
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

              {/* Agent Thinking Animation (Flat sequence) */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <img src="/images/devnexes-logo.png" alt="Logo" className="w-5 h-5 object-contain animate-pulse" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs text-slate-600 font-semibold">
                    <span>Cortex Mini is thinking</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reply Pills (Flat) */}
              {messages.length === 1 && !isLoading && (
                <div className="pl-9 pt-2 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Suggested Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_REPLIES.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="text-xs bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white px-3.5 py-1.5 rounded-full transition-all text-left font-medium"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline Lead Quote Form (Clean Bounds & Full Field Handling) */}
              {showLeadForm && !leadSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-1 my-2 p-4 bg-white rounded-2xl border border-blue-200 shadow-xl space-y-3 font-sans shrink-0"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                      <Sparkles size={14} className="text-blue-600" /> Request Custom Project Quote
                    </h4>
                    <button onClick={() => setShowLeadForm(false)} className="text-slate-400 hover:text-slate-700 p-1">
                      <X size={14} />
                    </button>
                  </div>

                  <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        required
                        value={leadData.name}
                        onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email or WhatsApp <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="you@example.com or +92 300 1234567"
                        required
                        value={leadData.contact}
                        onChange={e => setLeadData({ ...leadData, contact: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Service Interested In <span className="text-red-500">*</span></label>
                      <select
                        value={leadData.service}
                        onChange={e => setLeadData({ ...leadData, service: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      >
                        <option value="Custom Web Application">Custom Web Application</option>
                        <option value="AI Automation & Agents">AI Automation &amp; Agents</option>
                        <option value="SEO & Page Speed">SEO &amp; Page Speed</option>
                        <option value="UI/UX & Interactive Design">UI/UX &amp; Interactive Design</option>
                        <option value="Dedicated Engineering Team">Dedicated Engineering Team</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Details (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Briefly describe your project requirements..."
                        value={leadData.note || ''}
                        onChange={e => setLeadData({ ...leadData, note: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer mt-1"
                    >
                      {isSubmittingLead ? 'Submitting Request...' : 'Request Quote'}
                    </button>
                  </form>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── FOOTER / INPUT BAR (Clean Flat White) ── */}
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
                  className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-slate-200/80 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shrink-0"
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
