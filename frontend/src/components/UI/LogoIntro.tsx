'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const LogoIntro = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // We check if intro was already seen in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    if (hasSeenIntro === 'true') {
      setShouldRender(false)
      return
    }

    // Start Intro
    setShouldRender(true)
    setIsVisible(true)

    const finishIntro = () => {
      setIsVisible(false)
      sessionStorage.setItem('hasSeenIntro', 'true')
      // Clean up from DOM after fade out
      setTimeout(() => setShouldRender(false), 1200)
    }

    const timer = setTimeout(finishIntro, 3500)

    // Safety timeout - absolute fallback to hide intro if anything hangs
    const safetyTimer = setTimeout(() => {
      setIsVisible(false)
      setShouldRender(false)
      sessionStorage.setItem('hasSeenIntro', 'true')
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(safetyTimer)
    }
  }, [])

  if (!shouldRender) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="logo-intro-overlay"
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-4">
            {/* Logo and Animation Container */}
            <div className="relative py-20 px-10 flex flex-col items-center">
              
              {/* SVG Background Drawing - Enveloping "Rentora" */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox="0 0 600 200"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 
                  Coordinates Explanation (ViewBox 600x200):
                  M 50 140   -> Start underline under 'R'
                  L 550 140  -> Underline all the way to end of 'a'
                  L 550 110  -> Start vertical move for roof
                  L 300 20   -> High peak of the roof (above text)
                  L 50 110   -> Back down to left side
                  Z          -> Close the shape (back to start)
                */}
                <motion.path
                  d="M 50 145 L 550 145 L 550 120 L 300 20 L 50 120 L 50 145"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                  }}
                  transition={{ 
                    pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.5 },
                    opacity: { duration: 0.3, delay: 0.5 }
                  }}
                />
                
                {/* Glow layer */}
                <motion.path
                  d="M 50 145 L 550 145 L 550 120 L 300 20 L 50 120 L 50 145"
                  stroke="#2563eb"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="blur-lg opacity-20"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.5 }}
                />
              </svg>

              {/* Logo Text - Centered inside the house shape */}
              <motion.h1 
                className="text-7xl md:text-9xl font-black text-gray-900 font-serif tracking-tight z-10 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                Rentora
              </motion.h1>
            </div>

            {/* Subtitle and Loading Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="mt-12 text-center"
            >
              <p className="text-primary-600 font-black uppercase tracking-[0.6em] text-[10px] md:text-sm">
                Smart Rental Finder
              </p>
              <motion.div 
                className="h-1 w-24 bg-primary-100 mx-auto mt-6 rounded-full overflow-hidden"
              >
                 <motion.div 
                   className="h-full bg-primary-600"
                   initial={{ x: "-100%" }}
                   animate={{ x: "100%" }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 />
              </motion.div>
            </motion.div>
          </div>

          {/* Premium Background Blooms */}
          <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-50 rounded-full blur-[120px] opacity-40"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] opacity-40"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LogoIntro
