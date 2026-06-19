import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Field = ({ icon: Icon, label, ...props }) => (
  <div className="relative group">
    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/80 transition-colors pointer-events-none z-10" />
    <input
      {...props}
      placeholder=" "
      className="peer w-full bg-white/10 border border-white/20 hover:border-white/35 focus:border-white/55 rounded-2xl pl-11 pr-4 py-5 text-white text-base outline-none transition-all duration-200"
    />
    <label className="absolute left-11 top-1/2 -translate-y-1/2 text-white/45 text-base pointer-events-none transition-all duration-200
      peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-white/70
      peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/70">
      {label}
    </label>
  </div>
)

const PasswordField = ({ label, ...props }) => {
  const [show, setShow] = React.useState(false)
  return (
    <div className="relative group">
      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white/80 transition-colors pointer-events-none z-10" />
      <input
        {...props}
        type={show ? 'text' : 'password'}
        placeholder=" "
        className="peer w-full bg-white/10 border border-white/20 hover:border-white/35 focus:border-white/55 rounded-2xl pl-11 pr-12 py-5 text-white text-base outline-none transition-all duration-200"
      />
      <label className="absolute left-11 top-1/2 -translate-y-1/2 text-white/45 text-base pointer-events-none transition-all duration-200
        peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-white/70
        peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/70">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

const LoginSection = ({ t, onLogin }) => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = React.useState(true)
  const [formData, setFormData] = React.useState({ username: '', password: '', email: '' })
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  if (!t) return null

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '');
    fetch(`${API_BASE}${isLogin ? '/api/login' : '/api/register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        if (data.success) {
          if (isLogin) {
            onLogin(data.user, data.token)
            navigate(data.user.role === 'admin' ? '/admin' : '/')
          } else {
            alert('Registration successful! Please login.')
            setIsLogin(true)
          }
        } else {
          setError(data.message || data.error || 'Something went wrong')
        }
      })
      .catch(() => { setLoading(false); setError('Server connection failed') })
  }

  return (
    <section id="login-section" className="py-28 px-4 relative overflow-hidden flex items-center justify-center">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-400/8 rounded-full blur-[180px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-white text-3xl font-black font-outfit tracking-tight">
            {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
          </h2>
        </div>

        {/* Card */}
        <div className="relative bg-white/[0.07] backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-10 shadow-[0_32px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">

          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Tabs */}
          <div className="flex bg-black/20 rounded-2xl p-1 mb-8 border border-white/10">
            {['Sign In', 'Register'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError('') }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  (isLogin ? i === 0 : i === 1)
                    ? 'bg-white text-[#1e4b8b] shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {!isLogin && (
                <Field icon={Mail} label="Email Address" type="email" id="email" required onChange={handleChange} />
              )}

              <Field icon={User} label="Username" type="text" id="username" required onChange={handleChange} />

              <PasswordField label="Password" id="password" required onChange={handleChange} />

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-white/50 text-xs hover:text-white transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4 rounded accent-white shrink-0" />
                  <span className="text-white/55 text-sm">
                    I agree to the <span className="text-white font-semibold underline underline-offset-2 cursor-pointer">Terms & Conditions</span>
                  </span>
                </label>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                >
                  <p className="text-red-300 text-xs font-medium">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-white/90 disabled:opacity-50 text-[#1e4b8b] py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-[0_8px_24px_rgba(255,255,255,0.12)] mt-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Please wait...</>
                  : <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                }
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <ShieldCheck size={12} /> SSL Encrypted
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Zap size={12} /> Instant Access
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default LoginSection
