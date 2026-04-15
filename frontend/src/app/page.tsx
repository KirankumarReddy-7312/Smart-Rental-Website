'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SearchBar from '@/components/Search/SearchBar'
import FeaturedLocations from '@/components/Location/FeaturedLocations'
import HowItWorks from '@/components/UI/HowItWorks'
import ContactSection from '@/components/UI/ContactSection'
import { 
  HomeIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userRole = localStorage.getItem('userRole')
    
    if (isLoggedIn) {
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [router])

  if (!mounted) {
    return <div className="min-h-screen bg-white" />
  }

  const handleViewAllProperties = () => {
    window.dispatchEvent(new CustomEvent('show-happy-user'))
  }

  return (
    <>
      <motion.div 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
          {/* Hero Section */}
          <section 
            className="relative min-h-screen flex flex-col justify-start pt-[20vh] overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=80')" }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-serif">
                Find Your Perfect <span className="text-yellow-300 italic">Rental Home</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
                Thousands of premium properties with smart filters and transparent pricing.
              </p>

              <div className="mb-12">
                <button
                  onClick={handleViewAllProperties}
                  className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <SparklesIcon className="w-6 h-6" />
                  <span>View All Properties</span>
                </button>
              </div>
              
              {/* Search Bar */}
              <SearchBar />

            </div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </section>


          {/* Featured Locations */}
          <FeaturedLocations />


          {/* Owner CTA Section */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-primary-50 rounded-[3rem] p-8 md:p-16 border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/20 blur-[80px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10 max-w-2xl text-center md:text-left">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm border border-primary-100">
                    <HomeModernIcon className="w-4 h-4 text-primary-600" />
                    <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">Owner Services</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-serif">
                    Are You a <br />
                    <span className="text-primary-600 italic">Property Owner?</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-0 font-medium leading-relaxed">
                    List your flat with Rentora and connect with thousands of premium tenants in Bangalore. 
                    Get smart insights, real-time tracking, and fast closures.
                  </p>
                </div>

                <Link 
                  href="/owner/register" 
                  className="relative z-10 bg-gray-900 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-95 flex items-center space-x-3 shrink-0"
                >
                  <span>List Your Property</span>
                  <ArrowRightIcon className="w-5 h-5 text-primary-400" />
                </Link>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <HowItWorks />

          {/* Contact */}
          <ContactSection />
        </motion.div>
    </>
  )
}
