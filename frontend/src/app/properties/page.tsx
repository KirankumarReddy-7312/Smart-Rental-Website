import { API_BASE_URL } from '@/config/api'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BuildingOfficeIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  HeartIcon,
  StarIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Property {
  id: number
  property_id: string
  type_display: string
  building_type_display: string
  rent: number
  deposit: number
  property_size: number
  bathroom: number
  furnishing_display: string
  locality_name: string
  gym: boolean
  parking: boolean
  lift: boolean
  swimming_pool: boolean
  is_saved: boolean
  image: string
}

const PropertyCard = ({ property }: { property: Property }) => {
  const [isSaved, setIsSaved] = useState(property.is_saved)
  const router = useRouter()

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    const savedHomes = JSON.parse(localStorage.getItem('savedHomes') || '[]')
    let newSavedHomes
    if (isSaved) {
      newSavedHomes = savedHomes.filter((h: any) => h.id !== property.id)
      toast.success('Removed from Saved Homes')
    } else {
      newSavedHomes = [...savedHomes, property]
      toast.success('Added to Saved Homes')
    }
    localStorage.setItem('savedHomes', JSON.stringify(newSavedHomes))
    setIsSaved(!isSaved)
    window.dispatchEvent(new Event('storage'))
  }

  useEffect(() => {
    const savedHomes = JSON.parse(localStorage.getItem('savedHomes') || '[]')
    setIsSaved(savedHomes.some((h: any) => h.id === property.id))
  }, [property.id])

  const handleCardClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      toast("You are my happy user, so please login to get more details!", {
        id: 'happy-user-toast',
        icon: '😊',
      })
    }
    router.push(`/properties/${property.id}`)
  }

  return (
    <motion.div
      className="bg-white rounded-[2rem] shadow-xl overflow-hidden group border border-gray-100 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.building_type_display}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute inset-x-4 top-4 flex justify-between items-start z-10">
           <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 shadow-lg">
             {property.type_display}
           </span>
           <button 
            onClick={toggleSave}
            className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
           >
              {isSaved ? <HeartSolidIcon className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-400" />}
           </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
           <p className="text-white text-3xl font-black flex items-baseline">
             <span className="text-sm mr-1 font-bold">₹</span>
             {property.rent.toLocaleString()}
             <span className="text-xs font-bold opacity-70 ml-2">/ month</span>
           </p>
        </div>
      </div>

      <div className="p-8">
         <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
           {property.building_type_display}
         </h3>
         <div className="flex items-center text-gray-500 font-bold mb-6">
            <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
            {property.locality_name}
         </div>

         <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-50">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-gray-400" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">BHK</p>
                  <p className="text-sm font-black text-gray-700">{property.bathroom} BHK</p>
               </div>
            </div>
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-gray-400" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Area</p>
                  <p className="text-sm font-black text-gray-700">{property.property_size} ft²</p>
               </div>
            </div>
         </div>

         <div className="pt-6 flex justify-between items-center">
            <span className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
               {property.furnishing_display}
            </span>
            <div className="flex space-x-1">
               {[property.gym, property.parking, property.swimming_pool].map((a, i) => a && (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary-400" />
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  )
}

const LOCATION_IMAGES: Record<string, string> = {
  'Whitefield': 'https://www.prestigeoakville.info/project/prestige-oakville-whitefield.webp',
  'Electronic City': 'https://www.colive.com/blog/wp-content/uploads/2024/05/pg-in-Electronic-City-2.png',
  'Bellandur': 'https://img.hexahome.in/media/blogs/hexahome-blogs/bellandur-in-bangalore/hero-section-bl01dk.webp',
  'Yelahanka': 'https://img.hexahome.in/media/blogs/hexahome-blogs/yelahanka-bengaluru/hero-section.webp',
  'Varthur': 'https://www.prestigesevergreen.info/images/prestige/varthur-road.webp',
  'Kaggadasapura': 'https://www.nobroker.in/locality-iq/images/vidhan%20soudha.webp',
  'K.R Puram': 'https://img.hexahome.in/media/blogs/hexahome-blogs/kr-puram-old-layout-krishnarajapuram-bengaluru/hero-section-3.webp',
  'Krishnarajapura': 'https://img.hexahome.in/media/blogs/hexahome-blogs/kr-puram-old-layout-krishnarajapuram-bengaluru/hero-section-3.webp',
  'Brookefield': 'https://embassyprojectsindia.com/blog/wp-content/uploads/2025/07/Brookefield-Bangalore.webp',
  'Mahadevapura': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
  'Bommanahalli': 'https://www.prestigeoakville.info/project/prestige-oakville-whitefield.webp',
  'Sarjapur': 'https://img.hexahome.in/media/blogs/hexahome-blogs/sarjapur-road-bengaluru/hero-section.webp'
}

const PropertiesPage = () => {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        // Fetching from Analytics Summary to ensure shared state between view and analysis
        const sumRes = await fetch(`${API_BASE_URL}/api/analytics/summary/`, { cache: 'no-store' })
        if (!sumRes.ok) throw new Error("Sync failed")
        const data = await sumRes.json()
        
        const mappedData: Property[] = (data.full_details || []).map((p: any, idx: number) => {
          const loc = p.locality || 'Whitefield'
          return {
            id: idx + 1,
            property_id: p.property_id || `PROP-${idx}`,
            type_display: p.type_display || 'Premium Home',
            building_type_display: p.building_type || 'Elite Residence',
            rent: p.rent,
            deposit: p.deposit || p.rent * 3,
            property_size: p.property_size,
            bathroom: p.bathroom,
            furnishing_display: p.furnishing_display,
            locality_name: loc,
            gym: p.gym,
            parking: p.parking,
            lift: p.lift,
            swimming_pool: p.swimming_pool,
            is_saved: false,
            image: p.image || LOCATION_IMAGES[loc] || LOCATION_IMAGES['Whitefield']
          }
        })

        // Handle URL Filtering
        const locFilter = searchParams.get('location')?.toLowerCase()
        const filtered = locFilter 
          ? mappedData.filter(p => p.locality_name.toLowerCase().includes(locFilter))
          : mappedData

        setProperties(mappedData)
        setFilteredProperties(filtered)
      } catch (err) {
        console.error('Sync failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
           <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-primary-600 font-black text-xs uppercase tracking-[0.3em] mb-4"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Verified Listings</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-gray-900 leading-tight"
              >
                Bangalore <br />
                <span className="text-primary-600 italic">Premium Rentals</span>
              </motion.h1>
           </div>
           <div className="flex items-center space-x-4">
              <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-3">
                 <span className="text-sm font-black text-gray-900">{filteredProperties.length}</span>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Properties Found</span>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-4 bg-gray-900 text-white rounded-3xl hover:bg-primary-600 transition-all shadow-xl active:scale-95"
              >
                 <AdjustmentsHorizontalIcon className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* Search State / Active Filters */}
        <AnimatePresence>
          {searchParams.toString() && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2 self-center">Active Filters:</p>
              {Array.from(searchParams.entries()).map(([key, val]) => (
                <div key={key} className="bg-primary-50 text-primary-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center space-x-2 border border-primary-100 shadow-sm">
                   <span>{key}: {val}</span>
                   <Link href="/properties"><XMarkIcon className="w-3 h-3 cursor-pointer hover:text-red-500" /></Link>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] h-[450px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <BuildingOfficeIcon className="w-12 h-12 text-gray-200" />
                 </div>
                 <h3 className="text-2xl font-black text-gray-400 uppercase tracking-widest mb-2">No Properties Found</h3>
                 <p className="text-gray-400 font-medium mb-8">Try adjusting your filters for better results.</p>
                 <Link href="/properties" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg hover:bg-primary-700 transition-all">Clear All Filters</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PropertiesPage
