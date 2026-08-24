import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Preloader = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show clean splash loader on open, then smoothly exit
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

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
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-white select-none overflow-hidden"
        >
          {/* Circular Spinner Framing the Center Logo */}
          <div className="relative flex items-center justify-center">
            
            {/* Outer Static Track Ring */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[2.5px] border-blue-50/80" />

            {/* Animated Spinning Circular Loading Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.95, 
                ease: "linear" 
              }}
              className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-blue-600 border-r-blue-500"
            />

            {/* Center Official Devnexes Logo */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center p-5"
            >
              <img
                src="/images/devnexes-logo.png"
                alt="Devnexes Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
