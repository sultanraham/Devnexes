import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowLeft, ArrowRight, ShieldCheck, Cloud } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterSection = ({ t }) => {
  const navigate = useNavigate();
  if (!t) return null;

  return (
    <section className="min-h-screen w-full bg-white flex items-center justify-center p-4 md:p-6 relative overflow-x-hidden overflow-y-auto">
      
      {/* Elegant Atmospheric Auras */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Deep Primary Aura - Top Left */}
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-[#1e3a8a]/10 rounded-full blur-[120px] md:blur-[180px]" />
        
        {/* Secondary Soft Wash - Bottom Right */}
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] w-[800px] md:w-[1200px] h-[800px] md:h-[1200px] bg-indigo-500/10 rounded-full blur-[140px] md:blur-[200px]" />
        
        {/* Accent Glow - Top Right */}
        <div className="absolute top-[10%] right-[-5%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-blue-400/5 rounded-full blur-[100px] md:blur-[120px]" />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft size={12} />
        <span className="font-outfit font-bold text-[9px] tracking-[0.2em] uppercase">Home</span>
      </motion.button>

      <div className="w-full max-w-md relative z-10 py-12 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <img src="/images/devnexes-logo.png" alt="Devnexes Digital Solutions company logo" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
            <span className="text-gray-900 text-lg md:text-xl font-bold tracking-tighter font-outfit uppercase italic">
              Devnexes
            </span>
          </motion.div>

          <h1 className="text-gray-900 text-2xl md:text-[28px] font-bold font-outfit leading-tight mb-2 tracking-tight">
            Register <span className="text-[#1e3a8a]">Account</span>
          </h1>
          <p className="text-gray-400 text-[12px] md:text-[13px] max-w-[280px] mx-auto leading-relaxed font-medium font-outfit">
            Create your professional account and start scaling with intelligent automation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 20,
            delay: 0.05
          }}
          className="w-full relative"
        >
          {/* Enhanced Theme Glow - Sharp */}
          <div className="absolute inset-[-2px] bg-linear-to-tr from-[#1e3a8a]/20 via-[#1e3a8a]/5 to-[#1e3a8a]/20 rounded-none blur-md opacity-100" />
          <div className="absolute inset-[-10px] bg-[#1e3a8a]/5 rounded-none blur-2xl opacity-100" />
          
          <div className="relative bg-white/70 backdrop-blur-xl rounded-none p-6 md:p-8 shadow-[0_25px_50px_rgba(30,58,138,0.08)] border border-blue-100/50">
            <motion.form 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.1
                  }
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.98 },
                    show: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { type: "spring", stiffness: 120, damping: 18 }
                    }
                  }}
                  className="relative group"
                >
                  <input
                    type="text"
                    placeholder=" "
                    id="fullName"
                    className="peer w-full bg-white/50 border border-blue-100/50 rounded-none px-4 py-3 text-gray-900 font-outfit focus:outline-none focus:border-[#1e3a8a] transition-all text-[13px] placeholder-transparent"
                  />
                  <label 
                    htmlFor="fullName"
                    className="absolute left-4 top-3 text-gray-400 font-outfit transition-all pointer-events-none
                      peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-3
                      peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold peer-focus:bg-white/90 peer-focus:px-1.5
                      not-placeholder-shown:-top-2.5 not-placeholder-shown:left-2 not-placeholder-shown:text-[10px] not-placeholder-shown:text-gray-500 not-placeholder-shown:bg-white/90 not-placeholder-shown:px-1.5"
                  >
                    {t.fullName}
                  </label>
                </motion.div>

                {/* Email */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.98 },
                    show: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { type: "spring", stiffness: 120, damping: 18 }
                    }
                  }}
                  className="relative group"
                >
                  <input
                    type="email"
                    placeholder=" "
                    id="email"
                    className="peer w-full bg-white/50 border border-blue-100/50 rounded-none px-4 py-3 text-gray-900 font-outfit focus:outline-none focus:border-[#1e3a8a] transition-all text-[13px] placeholder-transparent"
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-4 top-3 text-gray-400 font-outfit transition-all pointer-events-none
                      peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-3
                      peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold peer-focus:bg-white/90 peer-focus:px-1.5
                      not-placeholder-shown:-top-2.5 not-placeholder-shown:left-2 not-placeholder-shown:text-[10px] not-placeholder-shown:text-gray-500 not-placeholder-shown:bg-white/90 not-placeholder-shown:px-1.5"
                  >
                    {t.email}
                  </label>
                </motion.div>
              </div>

              {/* Password */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.98 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 120, damping: 18 }
                  }
                }}
                className="relative group"
              >
                <input
                  type="password"
                  placeholder=" "
                  id="password"
                  className="peer w-full bg-white/50 border border-blue-100/50 rounded-none px-4 py-3 text-gray-900 font-outfit focus:outline-none focus:border-[#1e3a8a] transition-all text-[13px] placeholder-transparent"
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 top-3 text-gray-400 font-outfit transition-all pointer-events-none
                    peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-3
                    peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold peer-focus:bg-white/90 peer-focus:px-1.5
                    not-placeholder-shown:-top-2.5 not-placeholder-shown:left-2 not-placeholder-shown:text-[10px] not-placeholder-shown:text-gray-500 not-placeholder-shown:bg-white/90 not-placeholder-shown:px-1.5"
                >
                  {t.password}
                </label>
              </motion.div>

              {/* Confirm Password */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.98 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 120, damping: 18 }
                  }
                }}
                className="relative group"
              >
                <input
                  type="password"
                  placeholder=" "
                  id="confirmPassword"
                  className="peer w-full bg-white/50 border border-blue-100/50 rounded-none px-4 py-3 text-gray-900 font-outfit focus:outline-none focus:border-[#1e3a8a] transition-all text-[13px] placeholder-transparent"
                />
                <label 
                  htmlFor="confirmPassword"
                  className="absolute left-4 top-3 text-gray-400 font-outfit transition-all pointer-events-none
                    peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-3
                    peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-[10px] peer-focus:text-[#1e3a8a] peer-focus:font-bold peer-focus:bg-white/90 peer-focus:px-1.5
                    not-placeholder-shown:-top-2.5 not-placeholder-shown:left-2 not-placeholder-shown:text-[10px] not-placeholder-shown:text-gray-500 not-placeholder-shown:bg-white/90 not-placeholder-shown:px-1.5"
                >
                  {t.confirmPassword}
                </label>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { 
                    opacity: 1, 
                    x: 0,
                    transition: { type: "spring", stiffness: 100, damping: 15 }
                  }
                }}
                className="flex items-center gap-2 px-1 py-1"
              >
                <input type="checkbox" className="accent-[#1e3a8a] h-3.5 w-3.5 rounded-none" id="terms" />
                <label htmlFor="terms" className="text-gray-400 text-[11px] font-outfit leading-none">
                  I agree to the <span className="text-[#1e3a8a] font-bold cursor-pointer hover:underline">Terms</span>.
                </label>
              </motion.div>

              <motion.button 
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  show: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { type: "spring", stiffness: 120, damping: 12 }
                  }
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#050914] hover:bg-[#1e3a8a] text-white py-3.5 rounded-none font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-4 shadow-xl active:scale-[0.98] group tracking-tight"
              >
                <span>Register Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.form>

            <div className="text-center mt-6">
              <Link to="/#login-section" className="text-gray-400 font-medium font-outfit text-[12px] hover:text-gray-800 transition-colors">
                Already have an account? <span className="text-[#1e3a8a] font-bold ml-1">Login</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default RegisterSection
