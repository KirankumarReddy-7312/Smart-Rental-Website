'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface Location {
  id: number
  name: string
  property_count: number
  average_rent: number
  average_size: number
  imagePath: string
}

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - replace with API call
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
      }
    ]

    setTimeout(() => {
      setLocations(mockLocations)
      setLoading(false)
    }, 800)
  }, [])

  const LocationCard = ({ location }: { location: Location }) => {
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault()
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (!isLoggedIn) {
        window.dispatchEvent(new CustomEvent('show-happy-user'))
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
        return
      }
      window.location.href = `/properties?location=${location.name}`
    }

    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer group"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleCardClick}
      >
        {/* Location Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={location.imagePath} 
            alt={location.name}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Location Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-xl font-bold text-white tracking-tight">{location.name}</h3>
          </div>
        </div>

        {/* Location Stats */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <HomeIcon className="w-5 h-5 text-primary-600 mr-1" />
                <span className="text-2xl font-bold text-gray-900">
                  {location.property_count}
                </span>
              </div>
              <p className="text-sm text-gray-600">Properties</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-xl font-bold text-primary-600 mr-0.5">₹</span>
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(location.average_rent).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">Avg Rent</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1 text-primary-500" />
              <span>Avg Size: {Math.round(location.average_size)} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
            <span>Explore Properties</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-1 bg-primary-600 rounded-full" />
              <span className="text-xs font-black text-primary-600 uppercase tracking-[0.3em]">Bangalore Prime</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                  Discover Popular <br />
                  <span className="text-primary-600 italic">Neighborhoods</span>
                </h1>
                <p className="text-gray-500 mt-4 text-lg font-medium max-w-xl">
                  Explore premium listings across {locations.length} prime sectors in Bangalore. 
                  Find your space in the city's most vibrant communities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4">
                  <div className="skeleton-text h-6 mb-3" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="skeleton-text h-8" />
                    <div className="skeleton-text h-8" />
                  </div>
                  <div className="skeleton-text h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationsPage
