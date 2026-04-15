'use client'

import { API_BASE_URL } from '@/config/api'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPinIcon, 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserIcon,
  HeartIcon,
  ShareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckBadgeIcon
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
  description?: string
  image?: string
}

const PropertyDetails = () => {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)

    if (!loggedIn) {
      toast("You are my happy user, so please login to get more details!", {
        id: 'happy-user-toast',
        icon: '😊',
        duration: 5000,
        style: {
          borderRadius: '15px',
          background: '#1e293b',
          color: '#fff',
          fontWeight: 'bold'
        }
      })
    }

    const fetchProperty = async () => {
      try {
        setLoading(true)
        // Correcting the endpoint to target the Django Backend directly
        const response = await fetch(`${API_BASE_URL}/api/properties/${id}/`, {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          setProperty({
            id: data.id,
            property_id: data.property_id,
            type_display: data.type,
            building_type_display: data.building_type,
            rent: data.rent,
            deposit: data.deposit,
            property_size: data.property_size,
            bathroom: data.bathroom,
            furnishing_display: data.furnishing,
            locality_name: data.locality_name || data.locality?.name || "Bangalore",
            gym: data.gym,
            parking: data.parking,
            lift: data.lift,
            swimming_pool: data.swimming_pool,
            description: data.description || "A premium verified property located in the heart of the city, offering modern amenities and a sophisticated lifestyle.",
            image: data.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
          })
        } else {
          // Fallback to searching in Analytics dataset
          const sumRes = await fetch(`${API_BASE_URL}/api/analytics/summary/`)
          if (sumRes.ok) {
            const sumData = await sumRes.json()
            const detailMatch = sumData.full_details.find((_: any, idx: number) => (idx + 1).toString() === id)
            if (detailMatch) {
              setProperty({
                id: parseInt(id as string),
                property_id: detailMatch.property_id || `ANA-${id}`,
                type_display: detailMatch.type_display,
                building_type_display: detailMatch.building_type,
                rent: detailMatch.rent,
                deposit: detailMatch.deposit || detailMatch.rent * 3,
                property_size: detailMatch.property_size,
                bathroom: detailMatch.bathroom,
                furnishing_display: detailMatch.furnishing_display,
                locality_name: detailMatch.locality,
                gym: detailMatch.gym,
                parking: detailMatch.parking,
                lift: detailMatch.lift,
                swimming_pool: detailMatch.swimming_pool,
                description: "A premium verified property located in the heart of the city, offering modern amenities and a sophisticated lifestyle.",
                image: detailMatch.image
              })
            } else {
              toast.error('Property not found in local sync.')
            }
          }
        }
      } catch (err) {
        console.error('Fetch failed:', err)
        // Silent fallback - don't irritate the user with repeating toasts
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProperty()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md border border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <BuildingOfficeIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Listing Unavailable</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            This property listing is currently undergoing synchronization or has been removed from the platform.
          </p>
          <button 
            onClick={() => router.push('/properties')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest text-[10px]"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary-600">Properties</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{property.building_type_display}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Placeholder */}
            <motion.div 
              className="relative h-[400px] md:h-[500px] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {property.image ? (
                <img 
                  src={property.image} 
                  alt={property.building_type_display}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BuildingOfficeIcon className="w-32 h-32 text-gray-400 opacity-30" />
                </div>
              )}
              <div className="absolute top-6 left-6 flex space-x-3">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-primary-600 font-bold text-sm shadow-lg">Featured</span>
                <span className="px-4 py-2 bg-primary-600 text-white rounded-full font-bold text-sm shadow-lg">For Rent</span>
              </div>
              <div className="absolute top-6 right-6 flex space-x-2">
                <button onClick={() => setIsSaved(!isSaved)} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110">
                  {isSaved ? <HeartSolidIcon className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-gray-600" />}
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-transform hover:scale-110">
                  <ShareIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {/* Title & Basics */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2">{property.building_type_display}</h1>
                  <p className="flex items-center text-gray-500 text-lg">
                    <MapPinIcon className="w-5 h-5 mr-1 text-primary-500" />
                    {property.locality_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-primary-600">₹{property.rent.toLocaleString()}</p>
                  <p className="text-gray-500 font-bold">Monthly Rent</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <HomeIcon className="w-6 h-6 text-primary-500 mb-1" />
                  <span className="text-xl font-black text-gray-900">{property.type_display}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Configuration</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <BuildingOfficeIcon className="w-6 h-6 text-primary-500 mb-1" />
                  <span className="text-xl font-black text-gray-900">{property.bathroom}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <SparklesIcon className="w-6 h-6 text-primary-500 mb-1" />
                  <span className="text-xl font-black text-gray-900">{property.property_size}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Sq. Ft area</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl">
                  <CheckBadgeIcon className="w-6 h-6 text-primary-500 mb-1" />
                  <span className="text-sm font-black text-gray-900 text-center leading-tight">{property.furnishing_display}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">About this Property</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {isLoggedIn ? property.description : "You are my happy user, so please login to get more details about this wonderful property! We have exclusive info waiting for you."}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-wider text-sm">Property Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Gym', active: property.gym, icon: ShieldCheckIcon },
                  { label: 'Parking', active: property.parking, icon: BuildingOfficeIcon },
                  { label: 'Lift', active: property.lift, icon: BuildingOfficeIcon },
                  { label: 'Pool', active: property.swimming_pool, icon: SparklesIcon }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center p-4 rounded-2xl border-2 transition-all ${item.active ? 'border-primary-100 bg-primary-50/50 text-primary-700' : 'border-gray-50 text-gray-300 opacity-50'}`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-primary-600 sticky top-28">
              <div className="mb-6">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Security Deposit</p>
                <p className="text-2xl font-black text-gray-900">₹{property.deposit.toLocaleString()}</p>
              </div>

              {!isLoggedIn ? (
                <div className="space-y-4">
                   <div className="bg-primary-50 p-4 rounded-2xl flex items-start space-x-3">
                      <SparklesIcon className="w-6 h-6 text-primary-600 mt-0.5" />
                      <div>
                        <p className="text-primary-900 font-bold text-sm">Happy User! 😊</p>
                        <p className="text-primary-700 text-xs mt-1">Please login to contact the owner directly and view documents.</p>
                      </div>
                   </div>
                   <Link 
                    href="/login" 
                    className="w-full flex items-center justify-center py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg hover:bg-primary-700 transition-all uppercase tracking-widest text-sm"
                   >
                    Login to Connect
                   </Link>
                   <Link 
                    href="/register" 
                    className="w-full flex items-center justify-center py-4 border-2 border-primary-100 text-primary-600 rounded-2xl font-bold bg-white hover:bg-primary-50 transition-all text-sm"
                   >
                    Create Free Account
                   </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest text-sm">
                    Contact Owner
                  </button>
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-widest text-sm">
                    Schedule Visit
                  </button>
                </div>
              )}
            </div>

            {/* Trust Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-primary-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <CheckBadgeIcon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                <h4 className="text-lg font-black mb-2 relative z-10 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-yellow-400" />
                  Rentora Verified
                </h4>
                <p className="text-indigo-100 text-xs font-bold leading-relaxed relative z-10 uppercase tracking-wider">
                  Every property on Rentora undergoes a strict 10-point verification process to ensure safety and transparency for our "happy users".
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
