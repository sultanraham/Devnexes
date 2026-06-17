import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LoginSection = ({ t, onLogin, isRedirect }) => {
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
    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'
    const endpoint = isLogin ? '/api/login' : '/api/register'
    fetch(`${API_BASE}${endpoint}`, {
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
            navigate(data.user.role === 'admin' ? '/admin' : '/projects')
          } else {
            alert('Registration successful! Please login.')
            setIsLogin(true)
          }
        } else {
          setError(data.message || data.error || 'Something went wrong')
        }
      })
      .catch(() => {
        setLoading(false)
        setError('Server connection failed')
      })
  }

  return (
    <section id="login-section" className={`py-12 md:py-24 bg-transparent relative overflow-hidden ${isRedirect ? 'min-h-screen flex items-center' : ''}`}>
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-10 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          viewport={{ once: true }}
          className="bg-white/3 backdrop-blur-3xl rounded-[40px] p-6 md:p-12 w-full max-w-5xl border border-white/10"
        >
          <div className="flex flex-col lg:flex-row gap-12 md:gap-20">
            <div className="w-full lg:w-3/5">
              <div className="mb-10">
                <h2 className="text-white text-3xl md:text-[56px] font-bold mb-3 font-outfit tracking-tighter leading-none">
                  {isLogin ? 'Sign In' : 'Register'}
                </h2>
                <p className="text-white/40 text-base md:text-lg font-outfit">
                  {isLogin ? 'Welcome back to your elite portal.' : 'Join the Devnexes network.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                  <motion.div whileHover={{ x: 5 }} className="relative group">
                    <input
                      type="email" id="email" required placeholder=" " onChange={handleChange}
                      className="peer w-full bg-white/2 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white/30 focus:bg-white/5 transition-all outline-none placeholder-transparent text-base"
                    />
                    <label htmlFor="email" className="absolute left-5 top-4 text-white/30 pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white/60 peer-focus:bg-[#1e4b8b] peer-focus:px-2 not-placeholder-shown:-top-2.5 not-placeholder-shown:text-xs">Email Address</label>
                  </motion.div>
                )}
                <motion.div whileHover={{ x: 5 }} className="relative group">
                  <input
                    type="text" id="username" required placeholder=" " onChange={handleChange}
                    className="peer w-full bg-white/2 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white/30 focus:bg-white/5 transition-all outline-none placeholder-transparent text-base"
                  />
                  <label htmlFor="username" className="absolute left-5 top-4 text-white/30 pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white/60 peer-focus:bg-[#1e4b8b] peer-focus:px-2 not-placeholder-shown:-top-2.5 not-placeholder-shown:text-xs">Username</label>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="relative group">
                  <input
                    type="password" id="password" required placeholder=" " onChange={handleChange}
                    className="peer w-full bg-white/2 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-white/30 focus:bg-white/5 transition-all outline-none placeholder-transparent text-base"
                  />
                  <label htmlFor="password" className="absolute left-5 top-4 text-white/30 pointer-events-none transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-white/60 peer-focus:bg-[#1e4b8b] peer-focus:px-2 not-placeholder-shown:-top-2.5 not-placeholder-shown:text-xs">Password</label>
                </motion.div>

                {error && <p className="text-red-300 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 bg-white text-[#1e4b8b] py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                  {loading ? 'AUTHENTICATING...' : (isLogin ? 'PROCEED TO PORTAL' : 'REGISTER IDENTITY')}
                </motion.button>
              </form>

              <p className="mt-10 text-white/30 text-base text-center lg:text-left font-outfit">
                {isLogin ? 'New to Devnexes?' : 'Already a member?'}
                <motion.button
                  whileHover={{ scale: 1.05, color: '#fff' }}
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-white font-bold hover:text-blue-200 transition-colors border-b border-white/10 hover:border-blue-200"
                >
                  {isLogin ? 'Register now' : 'Sign in here'}
                </motion.button>
              </p>
            </div>

            <div className="hidden lg:flex w-2/5 flex-col justify-center gap-8 border-l border-white/5 pl-16">
              {[
                { icon: <Shield />, title: 'Elite Security', desc: 'JWT-protected sessions.' },
                { icon: <Cloud />, title: 'Instant Sync', desc: 'Real-time database updates.' }
              ].map((feat, i) => (
                <motion.div key={i} whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-default">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all"
                  >
                    {React.cloneElement(feat.icon, { className: 'text-white w-6 h-6' })}
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold text-xl font-outfit">{feat.title}</h4>
                    <p className="text-white/20 text-sm">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LoginSection
