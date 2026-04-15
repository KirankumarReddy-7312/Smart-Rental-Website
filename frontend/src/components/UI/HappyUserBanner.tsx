'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'

const HappyUserBanner = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleShow = () => {
      setShow(true)
      setTimeout(() => setShow(false), 5000)
    }

    window.addEventListener('show-happy-user', handleShow)
    return () => window.removeEventListener('show-happy-user', handleShow)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[100] px-10 py-5 bg-gray-900/95 backdrop-blur-2xl border border-gray-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center space-x-5 pointer-events-none min-w-[320px] md:min-w-[450px]"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: -20, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white text-base font-black tracking-tight leading-tight">
              You are my happy user! 😊
            </p>
            <p className="text-gray-400 text-sm font-bold mt-1">
              Please login to explore more exclusive details.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HappyUserBanner
