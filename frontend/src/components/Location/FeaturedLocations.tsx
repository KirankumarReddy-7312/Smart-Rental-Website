'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  MapPinIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Location {
  id: number
  name: string
  property_count: number
  average_rent: number
  average_size: number
  imagePath: string
}

const LocationCard = ({ location, isLoggedIn }: { location: Location, isLoggedIn: boolean }) => {
  return (
    <motion.div
      className="bg-white rounded-[2rem] shadow-xl overflow-hidden group border border-gray-100 hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={(e) => {
          if (!isLoggedIn) {
            window.dispatchEvent(new CustomEvent('show-happy-user'))
            setTimeout(() => {
              window.location.href = '/login'
            }, 2000)
            return
          }
          window.location.href = `/properties?location=${location.name}`
        }}
        className="w-full text-left"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={location.imagePath}
            alt={location.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 text-primary-400 mb-1">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Sector</span>
            </div>
            <h3 className="text-2xl font-black text-white">{location.name}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="flex items-center space-x-2 text-primary-600 mb-1">
                <HomeIcon className="w-4 h-4" />
                <span className="text-xl font-black text-gray-900 leading-none">
                  {location.property_count}
                </span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Listings</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="flex items-center space-x-1 text-primary-600 mb-1">
                <span className="text-lg font-bold">₹</span>
                <span className="text-xl font-black text-gray-900 leading-none">
                  {(location.average_rent / 1000).toFixed(1)}k
                </span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Rent</p>
            </div>
          </div>

          <div className="flex items-center justify-between group/btn">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Explore Properties</span>
            <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center group-hover/btn:bg-primary-600 transition-colors shadow-lg">
              <ArrowRightIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

const FeaturedLocations = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
    }
    checkLogin()
    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  useEffect(() => {
    // Artifact image paths from prompt context
    const mockLocations: Location[] = [
      {
        id: 1,
        name: 'Whitefield',
        property_count: 745,
        average_rent: 20268,
        average_size: 1297,
        imagePath: 'https://www.prestigeoakville.info/project/prestige-oakville-whitefield.webp'
      },
      {
        id: 2,
        name: 'Electronic City',
        property_count: 630,
        average_rent: 12576,
        average_size: 968,
        imagePath: 'https://www.colive.com/blog/wp-content/uploads/2024/05/pg-in-Electronic-City-2.png'
      },
      {
        id: 3,
        name: 'Bellandur',
        property_count: 313,
        average_rent: 25949,
        average_size: 1616,
        imagePath: 'https://img.hexahome.in/media/blogs/hexahome-blogs/bellandur-in-bangalore/hero-section-bl01dk.webp'
      },
      {
        id: 4,
        name: 'Yelahanka',
        property_count: 341,
        average_rent: 14641,
        average_size: 1125,
        imagePath: 'https://img.hexahome.in/media/blogs/hexahome-blogs/yelahanka-bengaluru/hero-section.webp'
      },
      {
        id: 5,
        name: 'Varthur',
        property_count: 130,
        average_rent: 14475,
        average_size: 1026,
        imagePath: 'https://www.prestigesevergreen.info/images/prestige/varthur-road.webp'
      },
      {
        id: 6,
        name: 'Kaggadasapura',
        property_count: 155,
        average_rent: 15844,
        average_size: 1037,
        imagePath: 'https://www.nobroker.in/locality-iq/images/vidhan%20soudha.webp'
      },
      {
        id: 7,
        name: 'K.R Puram',
        property_count: 118,
        average_rent: 11032,
        average_size: 883,
        imagePath: 'https://img.hexahome.in/media/blogs/hexahome-blogs/kr-puram-old-layout-krishnarajapuram-bengaluru/hero-section-3.webp'
      },
      {
        id: 8,
        name: 'Brookefield',
        property_count: 138,
        average_rent: 20619,
        average_size: 1347,
        imagePath: 'https://embassyprojectsindia.com/blog/wp-content/uploads/2025/07/Brookefield-Bangalore.webp'
      },
      {
        id: 9,
        name: 'Bommanahalli',
        property_count: 245,
        average_rent: 15400,
        average_size: 1100,
        imagePath: '/images/locations/bommanahalli.png'
      },
      {
        id: 10,
        name: 'Mahadevapura',
        property_count: 310,
        average_rent: 18900,
        average_size: 1250,
        imagePath: '/images/locations/mahadevapura.png'
      }
    ]

    setTimeout(() => {
      setLocations(mockLocations)
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 flex flex-col items-center justify-center animate-pulse">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl mb-4" />
            <div className="h-4 w-48 bg-gray-100 rounded-full mb-2" />
            <div className="h-3 w-32 bg-gray-100 rounded-full" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl">
            <motion.div 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-full mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
              </span>
              <span className="text-[10px] font-black text-primary-700 uppercase tracking-[0.2em]">Explore Bangalore</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Top Bangalore <br />
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent italic">
                Neighborhoods
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 font-semibold leading-relaxed max-w-2xl">
              Find your ideal habitat in the heart of India's Silicon Valley. 
              <span className="text-gray-400 block mt-2 text-lg font-medium">From serene luxury suburbs to high-energy tech hubs.</span>
            </p>
          </div>
          <Link
            href="/locations"
            className="group flex items-center space-x-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl"
          >
            <span>View All Sectors</span>
            <MapPinIcon className="w-5 h-5 group-hover:animate-bounce" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedLocations
