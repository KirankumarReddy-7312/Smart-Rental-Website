import { API_BASE_URL } from '@/config/api'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BuildingOffice2Icon, 
  MapPinIcon, 
  CurrencyRupeeIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  InboxIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Header from '@/components/Layout/Header'

const OwnerRegisterPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyTitle: '',
    location: 'Whitefield',
    rent: '',
    size: '',
    type: 'Apartment',
    bhk: '2 BHK',
    furnishing: 'Semi-furnished',
    bathrooms: '2',
    floor: '1',
    totalFloor: '5',
    propertyAge: '1',
    gym: true,
    lift: true,
    pool: false,
    parking: true
  })

  // Phone input handler to ensure +91 and 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith('+91')) value = '+91'
    
    // Extract actual digits after +91
    const digits = value.slice(3).replace(/\D/g, '').slice(0, 10)
    setFormData({ ...formData, phone: `+91${digits}` })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Check if phone has 10 digits after +91
    if (formData.phone.length !== 13) {
      toast.error('Please enter a valid 10-digit mobile number.')
      return
    }

    toast.loading('Registering your property...')
    
    const payload = {
      property_id: `PROP${Math.floor(Math.random() * 90000) + 10000}`,
      type_display: formData.bhk,
      building_type: formData.type, // Use the selected building type
      property_title: formData.propertyTitle,
      rent: parseInt(formData.rent) || 0,
      deposit: parseInt(formData.rent) * 3 || 0,
      property_size: parseInt(formData.size) || 0,
      bathroom: parseInt(formData.bathrooms) || 2,
      furnishing: formData.furnishing === 'Fully furnished' ? 'ff' : formData.furnishing === 'Semi-furnished' ? 'sf' : 'un',
      locality: formData.location,
      gym: formData.gym,
      lift: formData.lift,
      swimming_pool: formData.pool,
      parking: formData.parking,
      property_age: parseInt(formData.propertyAge) || 1,
      lease_type: 'ANYONE',
      floor: parseInt(formData.floor) || 1,
      total_floor: parseInt(formData.totalFloor) || 5,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/add-property/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Failed to save')
      
      toast.dismiss()
      setIsSubmitted(true)
      toast.success('Property registered successfully!')
    } catch(err) {
      toast.dismiss()
      toast.error('Failed to register property.')
      console.error(err)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-32">
        <motion.div 
          className="max-w-md w-full p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">LISTING SUCCESSFUL</h2>
          <p className="text-gray-400 font-medium mb-10 leading-relaxed text-sm">
            Your property has been listed. It is now live on our Rentora Analytics and Properties search engines.
          </p>
          <button 
            onClick={() => window.location.href = '/properties'}
            className="w-full bg-gray-900 text-white py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all font-sans"
          >
            Check Your Listing
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      <div className="max-w-[1400px] mx-auto px-8 pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="sticky top-32 lg:pr-8"
          >
            <div className="flex items-center gap-2 text-indigo-600 text-[11px] font-black uppercase tracking-[0.4em] mb-6">
                <BuildingOffice2Icon className="w-4 h-4" />
                Partner Portal
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tighter">
              List Your Property <br />
              <span className="text-indigo-600 italic font-medium">With Authority.</span>
            </h1>
            <p className="text-slate-600 text-lg mb-10 max-w-lg font-medium leading-relaxed">
              Our high-intent ecosystem connects your asset with verified high-net-worth individuals. Use our precision tools to reach the right market.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              {[
                { title: 'Verified Tenants', desc: 'Secure connection with vetted individuals.', icon: CheckCircleIcon },
                { title: 'Market Logic', desc: 'Predictive pricing using local ML models.', icon: MapPinIcon },
                { title: 'Instant Pipeline', desc: 'Syncs live with Market Intelligence hub.', icon: ArrowRightIcon },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5 group">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-400 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-slate-900 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="p-10 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section: Identity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Owner Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 focus:bg-white rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Contact</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-6 text-indigo-600 font-black text-xs border-r border-slate-200 pr-4">+91</span>
                        <input 
                          required
                          type="tel" 
                          placeholder="99999 99999"
                          className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 focus:bg-white rounded-xl py-4 pl-20 pr-6 outline-none transition-all font-bold text-slate-900"
                          value={formData.phone.replace('+91', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                            setFormData({...formData, phone: `+91${val}`})
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Property Title / Description</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Modern 3BHK Penthouse with Private Terrace"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 focus:bg-white rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      value={formData.propertyTitle}
                      onChange={(e) => setFormData({...formData, propertyTitle: e.target.value})}
                    />
                  </div>

                  {/* Section: Location & Format */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Locality</label>
                      <div className="relative">
                        <select 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 focus:bg-white rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer">
                          {['Whitefield', 'Electronic City', 'Bellandur', 'Yelahanka', 'Varthur', 'Kaggadasapura', 'K.R Puram', 'Brookefield', 'Mahadevapura', 'Bommanahalli'].map(loc => (
                            <option key={loc}>{loc}</option>
                          ))}
                        </select>
                        <MapPinIcon className="w-5 h-5 text-indigo-400 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Building Format</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-600 focus:bg-white rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer">
                        <option value="Apartment">Luxury Apartment</option>
                        <option value="Independent House">Standalone Villa</option>
                        <option value="Independent Floor">Penthouse / Duplex</option>
                      </select>
                    </div>
                  </div>

                  {/* Section: Technical Specs */}
                  <div className="bg-slate-50/50 p-8 rounded-3xl space-y-8 border border-slate-100">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Asset Configurations</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Config</label>
                        <select 
                          value={formData.bhk}
                          onChange={(e) => setFormData({...formData, bhk: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 outline-none font-bold text-slate-800 text-xs">
                          {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '1 RK'].map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Baths</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 outline-none font-bold text-slate-800 text-xs" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 outline-none font-bold text-slate-800 text-xs" value={formData.floor} onChange={(e) => setFormData({...formData, floor: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Age (Y)</label>
                        <input type="number" className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 outline-none font-bold text-slate-800 text-xs" value={formData.propertyAge} onChange={(e) => setFormData({...formData, propertyAge: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exp. Monthly Rent (₹)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900"
                          value={formData.rent}
                          onChange={(e) => setFormData({...formData, rent: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Build Area (Sqft)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full bg-white border border-slate-200 focus:border-indigo-600 rounded-xl py-4 px-6 outline-none transition-all font-bold text-slate-900"
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'gym', label: 'Gymnasium' },
                      { key: 'lift', label: 'Pro-Lift' },
                      { key: 'pool', label: 'Pool Side' },
                      { key: 'parking', label: 'Reserved Parking' }
                    ].map(amn => (
                      <button 
                        key={amn.key}
                        type="button"
                        onClick={() => setFormData({...formData, [amn.key]: !formData[amn.key as keyof typeof formData]})}
                        className={`py-3 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          formData[amn.key as keyof typeof formData] 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                            : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                        }`}
                      >
                        {amn.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-indigo-600 hover:scale-[1.01] transition-all duration-500 shadow-xl shadow-indigo-100">
                      Sync Listing & Publish
                    </button>
                  </div>
                </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OwnerRegisterPage
