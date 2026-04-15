'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'

interface SearchFilters {
  location: string
  minBudget: string
  maxBudget: string
  houseType: string
  bathrooms: string
  furnishing: string
  amenities: string[]
}

const SearchBar = ({ onSearch }: { onSearch?: (filters: SearchFilters) => void }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    minBudget: '',
    maxBudget: '',
    houseType: '',
    bathrooms: '',
    furnishing: '',
    amenities: []
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)

  useEffect(() => {
    const handleOpenSearch = () => {
      setIsMinimized(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('open-search', handleOpenSearch)
    return () => window.removeEventListener('open-search', handleOpenSearch)
  }, [])

  const locations = [
    'Whitefield', 'Bellandur', 'Varthur', 'Kaggadasapura',
    'K.R Puram', 'Electronic City', 'Brookefield', 'Yelahanka',
    'Bommanahalli', 'Krishnarajapura', 'Mahadevapura'
  ]

  const houseTypes = [
    'Apartment', 'Independent House', 'Independent Floor'
  ]

  const bathroomOptions = [
    '1', '2', '3', '4+'
  ]

  const amenityOptions = [
    { id: 'gym', label: 'Gym', icon: SparklesIcon },
    { id: 'parking', label: 'Parking', icon: BuildingOfficeIcon },
    { id: 'lift', label: 'Lift', icon: BuildingOfficeIcon },
    { id: 'swimming_pool', label: 'Swimming Pool', icon: BuildingOfficeIcon }
  ]

  const router = useRouter()

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters)
    } else {
      const params = new URLSearchParams()
      if (filters.location) params.append('location', filters.location)
      if (filters.minBudget) params.append('minBudget', filters.minBudget)
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget)
      if (filters.houseType) params.append('houseType', filters.houseType)
      if (filters.bathrooms) params.append('bathrooms', filters.bathrooms)
      if (filters.furnishing) params.append('furnishing', filters.furnishing)
      if (filters.amenities.length) params.append('amenities', filters.amenities.join(','))
      
      setIsMinimized(true)
      router.push(`/analytics?${params.toString()}`)
    }
  }

  return (
    <motion.div
      className={`relative z-40 transition-all duration-500 ease-in-out ${isMinimized ? 'max-w-xs mx-auto' : 'max-w-4xl mx-auto'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glass rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 group">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute top-4 right-4 text-primary-600 hover:text-primary-700 z-50 p-2 bg-primary-50 rounded-full transition-all hover:rotate-12"
        >
          {isMinimized ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>

        {isMinimized ? (
          <button 
            onClick={() => setIsMinimized(false)}
            className="flex items-center justify-center space-x-3 w-full py-4 group/search"
          >
             <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover/search:scale-110 group-hover/search:rotate-6 transition-all">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
             </div>
             <div className="text-left">
               <span className="block text-xs font-black text-gray-900 uppercase tracking-widest">Enable Smart Search</span>
               <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">Click to find your home</span>
             </div>
          </button>
        ) : (
          <div className="flex flex-col space-y-5">
            <div className="flex items-center space-x-3 px-1">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Smart Search</h3>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Bangalore Prime</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-600 uppercase ml-2 tracking-widest">Locality</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm font-medium text-gray-700"
                  >
                    <option value="">Select Local Area</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-600 uppercase ml-2 tracking-widest">Budget Range (₹)</label>
                <div className="flex space-x-3">
                  <div className="relative flex-1 group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm group-focus-within:text-primary-600">₹</span>
                    <input
                      type="number"
                      value={filters.minBudget}
                      onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                      placeholder="Min"
                      className="w-full pl-7 pr-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>
                  <div className="relative flex-1 group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm group-focus-within:text-primary-600">₹</span>
                    <input
                      type="number"
                      value={filters.maxBudget}
                      onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                      placeholder="Max"
                      className="w-full pl-7 pr-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300 placeholder:font-normal"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* House Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-600 uppercase ml-2 tracking-widest">Type</label>
                  <select
                    value={filters.houseType}
                    onChange={(e) => handleFilterChange('houseType', e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-xs font-bold text-gray-600"
                  >
                    <option value="">Any Type</option>
                    {houseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-600 uppercase ml-2 tracking-widest">BHK</label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-xs font-bold text-gray-600"
                  >
                    <option value="">Any BHK</option>
                    {bathroomOptions.map(option => (
                      <option key={option} value={option}>{option} BHK</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <motion.button
                onClick={handleSearch}
                className="w-full py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 text-white rounded-2xl font-black shadow-[0_10px_20px_rgba(37,99,235,0.3)] flex items-center justify-center space-x-2 relative group overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <MagnifyingGlassIcon className="h-6 w-6 relative z-10" />
                <span className="relative z-10 uppercase tracking-widest">Find Properties</span>
              </motion.button>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-[10px] font-black text-primary-500 hover:text-primary-700 uppercase tracking-widest flex items-center justify-center"
              >
                <FunnelIcon className="h-3 w-3 mr-1" />
                {showAdvanced ? 'Hide Amenities' : 'Advanced Amenities'}
              </button>

              {showAdvanced && (
                <motion.div
                  className="grid grid-cols-2 gap-2 pt-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all ${
                        filters.amenities.includes(amenity.id)
                          ? 'border-primary-500 bg-primary-600 text-white'
                          : 'border-gray-50 bg-gray-50/30 text-gray-400 hover:border-primary-200'
                      }`}
                    >
                      <amenity.icon className="w-3.5 h-3.5" />
                      <span>{amenity.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar
