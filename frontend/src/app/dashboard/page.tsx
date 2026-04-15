'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  BellIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  HomeModernIcon,
  CurrencyRupeeIcon,
  MapPinIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [savedHomes, setSavedHomes] = useState<any[]>([])
  const [searchForm, setSearchForm] = useState({
    location: '',
    priceRange: '₹10k - ₹25k',
    furnishing: '',
    bhk: [] as string[],
    tenant: ''
  })
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    
    if (role === 'admin') {
      router.push('/admin')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedHomes') || '[]')
      setSavedHomes(saved)
    }

    loadSaved()
    window.addEventListener('storage', loadSaved)
    return () => window.removeEventListener('storage', loadSaved)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    window.dispatchEvent(new Event('storage'))
    toast.success('Logged out successfully')
    router.push('/')
  }

  const getLocationImage = (locality: string) => {
    const images: Record<string, string> = {
      'Whitefield': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'Electronic City': 'https://images.unsplash.com/photo-1545324418-f1d3ac1ef730?auto=format&fit=crop&w=800&q=80',
      'Bellandur': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'Indiranagar': 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
      'Koramangala': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      'HSR Layout': 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=800&q=80'
    }
    return images[locality] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col pt-24 shadow-sm">
        <div className="px-6 mb-8">
           <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">Premium Member</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
           {[
             { id: 'overview', name: 'Overview', icon: ChartBarIcon },
             { id: 'insights', name: 'Neighborhood Match', icon: MapPinIcon },
             { id: 'search', name: 'Advanced Search', icon: MagnifyingGlassIcon },
             { id: 'favorites', name: 'Saved Homes', icon: HeartIcon },
             { id: 'history', name: 'Search History', icon: ClockIcon },
             { id: 'settings', name: 'Profile Settings', icon: Cog6ToothIcon },
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                 activeTab === item.id 
                 ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' 
                 : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
               }`}
             >
               <item.icon className="w-5 h-5" />
               <span className="text-sm tracking-tight">{item.name}</span>
             </button>
           ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
           >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-4 md:px-8 pb-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
             <div>
                <h1 className="text-3xl font-black text-gray-900">Welcome Home, {user.name.split(' ')[0]}! 🏠</h1>
                <p className="text-gray-500 font-medium">Your personal real estate concierge is ready.</p>
             </div>
             <div className="flex space-x-3">
                <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 relative">
                   <BellIcon className="w-6 h-6" />
                   <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                </button>
             </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-blue-500 hover:shadow-xl transition-all">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Saved Listings</p>
                    <p className="text-4xl font-black text-gray-900">{savedHomes.length}</p>
                    <div className="mt-4 flex items-center text-xs text-blue-600 font-bold">
                       <SparklesIcon className="w-4 h-4 mr-1" />
                       {savedHomes.length > 0 ? `${savedHomes.length} properties in your list` : 'No homes saved yet'}
                    </div>
                  </div>
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-primary-500 hover:shadow-xl transition-all">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Visits Scheduled</p>
                    <p className="text-4xl font-black text-gray-900">02</p>
                    <div className="mt-4 flex items-center text-xs text-primary-600 font-bold">
                       <ClockIcon className="w-4 h-4 mr-1" />
                       Next: Tomorrow, 11 AM
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-b-4 border-b-indigo-500 hover:shadow-xl transition-all">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Profile Rank</p>
                    <p className="text-4xl font-black text-gray-900">Top 5%</p>
                    <div className="mt-4 flex items-center text-xs text-indigo-600 font-bold">
                       <CheckBadgeIcon className="w-4 h-4 mr-1" />
                       Verified Renter Score
                    </div>
                 </div>
              </div>

              {/* Requirement Matcher Form - Premium Integration */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 blur-[100px] rounded-full -mr-32 -mt-32 transition-colors group-hover:bg-primary-100" />
                 
                 <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-8">
                       <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                          <SparklesIcon className="w-6 h-6 text-white" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Find My Perfect Location</h2>
                          <p className="text-sm text-gray-500 font-medium">Tell us what you need, and we'll match you with the best Bangalore neighborhoods.</p>
                       </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={(e) => {
                       e.preventDefault();
                       toast.success('Analyzing your lifestyle requirements...', {
                          icon: '🧠',
                          style: { borderRadius: '20px', padding: '16px', fontWeight: 'bold' }
                       });
                       setTimeout(() => setActiveTab('insights'), 1500);
                    }}>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Office Zip/Area</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Whitefield" 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold placeholder:text-gray-300"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Budget</label>
                          <select className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold appearance-none">
                             <option>₹15k - ₹30k</option>
                             <option>₹30k - ₹60k</option>
                             <option>₹60k - ₹1L</option>
                             <option>₹1L+</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Commute Priority</label>
                          <select className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-4 px-6 outline-none transition-all font-bold appearance-none">
                             <option>Walking Distance</option>
                             <option>Under 20 Mins</option>
                             <option>Metro Access</option>
                             <option>Doesn't Matter</option>
                          </select>
                       </div>
                       
                       <div className="md:col-span-3 pt-4">
                          <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all">
                             Generate Recommendations
                          </button>
                       </div>
                    </form>
                 </div>
              </div>

              {/* Detailed Personal Info Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                   <UserIcon className="w-6 h-6 mr-3 text-primary-500" />
                   Account Credentials & Bio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email Identifier</p>
                        <p className="font-bold text-gray-700">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mobile Contact</p>
                        <p className="font-bold text-gray-700">{user.phone || '+91 99****8877'}</p>
                      </div>
                   </div>
                   <div className="space-y-6 text-sm text-gray-500">
                      <p className="leading-relaxed border-l-4 border-primary-500 pl-4 py-2 bg-primary-50/30 rounded-r-xl italic">
                        &quot;I am looking for a 3 BHK semi-furnished apartment in Whitefield area with easy access to EPIP zone. Prefer high-floor apartments with park views.&quot;
                      </p>
                      <button className="text-primary-600 font-extrabold uppercase tracking-widest text-xs hover:underline">
                        Edit detailed preferences
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Location Comparison Table */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <MapPinIcon className="w-6 h-6 mr-3 text-primary-500" />
                    Neighborhood Performance
                  </h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Whitefield', score: 92, label: 'Tech Hub', color: 'bg-emerald-500' },
                      { name: 'Indiranagar', score: 88, label: 'Lifestyle', color: 'bg-blue-500' },
                      { name: 'Koramangala', score: 85, label: 'Startup Hub', color: 'bg-indigo-500' },
                      { name: 'HSR Layout', score: 82, label: 'Residential', color: 'bg-purple-500' },
                    ].map((loc) => (
                      <div key={loc.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="font-bold text-gray-900">{loc.name}</span>
                            <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{loc.label}</span>
                          </div>
                          <span className="text-sm font-black text-gray-900">{loc.score}% Match</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${loc.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${loc.score}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Insights */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <ChartBarIcon className="w-6 h-6 mr-3 text-primary-500" />
                    Bangalore Market Trends
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Avg. Appreciation</p>
                      <p className="text-2xl font-black text-gray-900">+12.4%</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Rent Yield</p>
                      <p className="text-2xl font-black text-gray-900">4.2%</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-xl">
                          <CurrencyRupeeIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Demand Index</span>
                      </div>
                      <span className="text-sm font-black text-primary-600">High</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-xl">
                          <ClockIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">Avg. Closure Time</span>
                      </div>
                      <span className="text-sm font-black text-primary-600">14 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'search' && (
            <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                  <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-primary-500" />
                  Professional Property Search
                </h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => {
                  e.preventDefault();
                  
                  const minBudget = searchForm.priceRange.split('-')[0].replace('₹','').replace('k','000').trim();
                  const maxBudget = searchForm.priceRange.split('-')[1]?.replace('₹','').replace('k','000').trim() || '';
                  
                  const params = new URLSearchParams();
                  if (searchForm.location) params.set('location', searchForm.location);
                  if (minBudget) params.set('minBudget', minBudget);
                  if (maxBudget) params.set('maxBudget', maxBudget);
                  if (searchForm.furnishing) params.set('furnishing', searchForm.furnishing);
                  if (searchForm.bhk.length > 0) params.set('houseType', searchForm.bhk.join(','));
                  if (searchForm.tenant) params.set('tenant', searchForm.tenant);

                  toast.success('Directing to live listings...');
                  router.push(`/properties?${params.toString()}`);
                }}>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Preferred Locality</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Whitefield, Indiranagar" 
                        value={searchForm.location}
                        onChange={(e) => setSearchForm({...searchForm, location: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all font-bold placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Price Range</label>
                    <div className="relative">
                      <CurrencyRupeeIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select 
                        value={searchForm.priceRange}
                        onChange={(e) => setSearchForm({...searchForm, priceRange: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary-500 rounded-2xl py-5 pl-14 pr-6 outline-none transition-all font-bold appearance-none"
                      >
                        <option>₹10k - ₹25k</option>
                        <option>₹25k - ₹50k</option>
                        <option>₹50k - ₹1L</option>
                        <option>₹1L+</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Furnishing Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Fully', 'Semi', 'Un'].map(f => (
                        <label key={f} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${searchForm.furnishing === f ? 'border-primary-500 bg-primary-50' : 'border-gray-50 bg-gray-50/50 hover:border-primary-200'}`}>
                          <input 
                            type="radio" 
                            name="furn" 
                            className="hidden" 
                            checked={searchForm.furnishing === f}
                            onChange={() => setSearchForm({...searchForm, furnishing: f})}
                          />
                          <span className={`text-xs font-bold ${searchForm.furnishing === f ? 'text-primary-700' : 'text-gray-700'}`}>{f}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Unit Configuration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map(b => (
                        <label key={b} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${searchForm.bhk.includes(b) ? 'border-primary-500 bg-primary-50' : 'border-gray-50 bg-gray-50/50 hover:border-primary-200'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={searchForm.bhk.includes(b)}
                            onChange={(e) => {
                              const newBhk = e.target.checked 
                                ? [...searchForm.bhk, b] 
                                : searchForm.bhk.filter(item => item !== b);
                              setSearchForm({...searchForm, bhk: newBhk});
                            }}
                          />
                          <span className={`text-[10px] font-bold ${searchForm.bhk.includes(b) ? 'text-primary-700' : 'text-gray-700'}`}>{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Tenant Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Bachelor', 'Family'].map(t => (
                        <label key={t} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all group ${searchForm.tenant === t ? 'border-primary-500 bg-primary-50' : 'border-gray-50 bg-gray-50/50 hover:border-primary-400'}`}>
                          <input 
                            type="radio" 
                            name="lease_type" 
                            className="hidden" 
                            checked={searchForm.tenant === t}
                            onChange={() => setSearchForm({...searchForm, tenant: t})}
                          />
                          <span className={`text-xs font-black uppercase tracking-widest ${searchForm.tenant === t ? 'text-primary-600' : 'text-gray-600 group-hover:text-primary-600'}`}>{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Essential Amenities</label>
                    <div className="flex flex-wrap gap-3">
                      {['Gym', 'Swimming Pool', 'Covered Parking', '24/7 Security', 'Power Backup', 'Lift'].map(a => (
                        <label key={a} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-primary-50 transition-all">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500" />
                          <span className="text-xs font-bold text-gray-600">{a}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="w-full bg-primary-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center space-x-3">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      <span>Search Market Inventory</span>
                    </button>
                  </div>
                </form>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <HeartIcon className="w-6 h-6 mr-3 text-red-500" />
                Recently Saved Homes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedHomes.length > 0 ? (
                  savedHomes.map((home, i) => {
                    const locality = typeof home.locality_name === 'string' ? home.locality_name : home.locality_name?.name || 'Bangalore';
                    return (
                      <motion.div 
                        key={`${home.id}-${i}`} 
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex h-32 group hover:shadow-xl transition-all cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => router.push(`/properties/${home.id}`)}
                      >
                        <img 
                          src={home.image || getLocationImage(locality)} 
                          className="w-32 h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={home.building_type_display}
                        />
                        <div className="p-4 flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-gray-900 truncate pr-4">{home.building_type_display}</h4>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSaved = savedHomes.filter(h => h.id !== home.id);
                                localStorage.setItem('savedHomes', JSON.stringify(newSaved));
                                setSavedHomes(newSaved);
                                toast.success('Removed from favorites');
                              }}
                              className="text-red-500 hover:scale-110 transition-transform p-1"
                            >
                              <HeartSolidIcon className="w-5 h-5 fill-red-500" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-bold">{locality}</p>
                          <p className="mt-2 text-primary-600 font-black text-sm">₹{home.rent.toLocaleString()}/mo</p>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="md:col-span-2 py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-4">
                    <HeartIcon className="w-16 h-16 text-gray-200 mb-4" />
                    <h4 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">No Saved Homes</h4>
                    <p className="text-gray-400 font-medium mb-8">Start exploring properties and save your favorites to see them here.</p>
                    <Link href="/properties" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
                      Browse Properties
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <ClockIcon className="w-6 h-6 mr-3 text-blue-500" />
                Search History
              </h3>
              <div className="space-y-4">
                {[
                  { q: '3 BHK in Whitefield', date: 'Today, 2:40 PM', hits: 145 },
                  { q: 'Gated community Bellandur', date: 'Yesterday', hits: 89 },
                  { q: 'Parking available Electronic City', date: 'Mar 12', hits: 210 },
                ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{h.q}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{h.date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-primary-600">{h.hits} Results</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <Cog6ToothIcon className="w-6 h-6 mr-3 text-gray-600" />
                Profile Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</label>
                       <input type="text" defaultValue={user.name} className="w-full bg-gray-50 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary-500 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Notifications</label>
                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-sm font-bold">New Property Alerts</span>
                          <div className="w-12 h-6 bg-primary-600 rounded-full relative">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100">
                    <h4 className="font-black text-primary-900 mb-2">Security Verification</h4>
                    <p className="text-xs text-primary-700 leading-relaxed mb-4">You are currently using 2-factor authentication. Your account is extremely secure.</p>
                    <button className="text-xs font-black uppercase tracking-widest text-white bg-primary-600 px-6 py-3 rounded-xl shadow-lg shadow-primary-200">Reset Password</button>
                 </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-50 text-right">
                 <button onClick={() => toast.success('Settings updated successfully!')} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'insights' && activeTab !== 'search' && activeTab !== 'favorites' && activeTab !== 'history' && activeTab !== 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
               <SparklesIcon className="w-16 h-16 text-primary-200 mb-4" />
               <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">Section Under Construction</p>
               <p className="text-sm text-gray-300">We are fine-tuning this for your elite experience.</p>
               <button onClick={() => setActiveTab('overview')} className="mt-6 text-primary-600 font-black">Return Home</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const CheckBadgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export default Dashboard
