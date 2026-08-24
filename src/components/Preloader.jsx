import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Preloader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show splash screen on open, then smoothly exit
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1600)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white select-none overflow-hidden"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Brand Container */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.7, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative"
            >
              <img
                src="/images/devnexes-logo.png"
                alt="Devnexes Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight text-[#061632]">
                Devnexes
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-blue-600 tracking-[0.25em] uppercase -mt-0.5">
                Digital Solutions
              </span>
            </motion.div>

            {/* Smooth Circular Loading Spinner */}
            <div className="relative flex items-center justify-center mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-blue-100" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.85, 
                  ease: "linear" 
                }}
                className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
