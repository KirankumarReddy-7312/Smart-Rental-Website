import { API_BASE_URL } from '@/config/api'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Activity, 
  LayoutDashboard, 
  Database, 
  Zap, 
  Scale,
  DollarSign,
  Home,
  AlertCircle,
  Building2,
  ChevronRight,
  Search
} from 'lucide-react'
import Header from '@/components/Layout/Header'
import Link from 'next/link'
import Chart from 'chart.js/auto'
import { useSearchParams } from 'next/navigation'

const AnalyticsPage = () => {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState('market')
    const [liveData, setLiveData] = useState<any>(null)
    const [gridSearch, setGridSearch] = useState('')
    const [selectedLocality, setSelectedLocality] = useState<string | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const location = searchParams.get('location')
        const minBudget = searchParams.get('minBudget')
        const maxBudget = searchParams.get('maxBudget')
        
        if (location || minBudget || maxBudget) {
            if (location) setGridSearch(location)
            setActiveTab('inventory')
        }
    }, [searchParams])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sumRes = await fetch(`${API_BASE_URL}/api/analytics/summary/`, { cache: 'no-store' })
                if (!sumRes.ok) throw new Error("Backend connection failed")
                const data = await sumRes.json()
                setLiveData(data)
            } catch (e) {
                console.error("API error", e)
                setError(true)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!liveData || activeTab !== 'market') return

        const initCharts = () => {
            const ctx1 = document.getElementById('chart-rent-benchmarks') as HTMLCanvasElement
            const ctx2 = document.getElementById('chart-bhk-dist') as HTMLCanvasElement

            if (ctx1) {
                new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(liveData.summary.locality_counts),
                        datasets: [{
                            label: 'Property Volume',
                            data: Object.values(liveData.summary.locality_counts),
                            backgroundColor: '#111827',
                            borderRadius: 12,
                            barThickness: 24
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                    }
                })
            }

            if (ctx2) {
                new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(liveData.summary.bhk_distribution),
                        datasets: [{
                            data: Object.values(liveData.summary.bhk_distribution),
                            backgroundColor: ['#111827', '#4B5563', '#9CA3AF', '#E5E7EB'],
                            borderWidth: 0
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: { legend: { display: false } }
                    }
                })
            }
        }

        const timer = setTimeout(initCharts, 100)
        return () => clearTimeout(timer)
    }, [liveData, activeTab])

    if (error) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
            </motion.div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase mb-2">Sync Interrupted</h2>
            <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                We're having trouble connecting to the intelligence engine. Please ensure your backend services are active.
            </p>
        </div>
    )

    const filteredRows = (liveData?.full_details || []).filter((row: any) => {
        const locationMatch = Object.values(row).some(v => String(v).toLowerCase().includes(gridSearch.toLowerCase()))
        
        const minBudget = parseInt(searchParams.get('minBudget') || '0')
        const maxBudget = parseInt(searchParams.get('maxBudget') || '9999999')
        const rent = parseInt(row.rent)
        
        const budgetMatch = rent >= minBudget && rent <= maxBudget
        
        return locationMatch && budgetMatch
    })

    if (!liveData) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="mb-4">
                <BarChart3 className="w-12 h-12 text-indigo-500" />
            </motion.div>
            <h2 className="text-sm font-bold text-indigo-400 grayscale tracking-widest uppercase">Syncing Market Data...</h2>
            <p className="text-[10px] text-gray-400 mt-2 italic">Processing 11 Locality Datasets...</p>
        </div>
    )

    const handleSearchClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setActiveTab('inventory')
        setTimeout(() => {
            document.getElementById('inventory-search-input')?.focus()
        }, 100)
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950 font-sans selection:bg-indigo-600 selection:text-white">
            <Header />

            {/* Dashboard Header */}
            <div className="pt-32 pb-8 border-b border-gray-200 bg-white shadow-sm">
                <div className="max-w-[1600px] mx-auto px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em]">
                                <Activity className="w-4 h-4" />
                                Real-Time Market Intelligence
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter text-gray-900">
                                Rental <span className="text-indigo-600 font-light">Analytics</span>
                            </h1>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleSearchClick}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                <Search className="w-4 h-4" /> Search Property
                            </button>
                            <Link href="/owner/register" className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Add New Property
                            </Link>
                        </div>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex space-x-12">
                        {[
                            { id: 'market', label: 'Market Overview', icon: LayoutDashboard },
                            { id: 'insights', label: 'Market Insights', icon: Zap },
                            { id: 'analysis', label: 'Pricing Analysis', icon: Scale },
                            { id: 'inventory', label: 'Property Inventory', icon: Database }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                                    activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-8 py-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'market' && (
                        <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            {/* High-Level Cards */}
                            <div className="grid grid-cols-4 gap-8">
                                {[
                                    { label: 'Total Inventory', val: liveData?.summary?.total_properties || 0, sub: 'Balanced Dataset', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'Avg Monthly Rent', val: `₹${(liveData?.summary?.avg_rent || 0).toLocaleString()}`, sub: 'Bengaluru Benchmarks', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Avg Rent per Sqft', val: `₹${liveData?.summary?.avg_rent_psf || 0}`, sub: 'Market Standard', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                                    { label: 'Luxury Assets', val: Object.values(liveData?.luxury_counts || {}).reduce((a:any,b:any)=>a+b,0), sub: 'Premium BHK4+', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' }
                                ].map((m, i) => (
                                    <div key={i} className="p-8 border border-gray-100 rounded-[2rem] bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                                                <m.icon className="w-5 h-5" />
                                            </div>
                                            <TrendingUp className="w-4 h-4 text-gray-200 group-hover:text-indigo-200 transition-colors" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                                        <h3 className="text-3xl font-black text-gray-900 mb-1">{m.val}</h3>
                                        <p className="text-xs font-bold text-gray-400">{m.sub}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 p-10 border border-gray-100 rounded-[2.5rem] bg-white">
                                    <h4 className="text-md font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-gray-400">
                                        <BarChart3 className="w-5 h-5 text-indigo-600" /> Locality Volume Distribution
                                    </h4>
                                    <div className="h-[400px]">
                                        <canvas id="chart-rent-benchmarks"></canvas>
                                    </div>
                                </div>
                                <div className="p-10 border border-gray-100 rounded-[2.5rem] bg-white flex flex-col items-center justify-center">
                                    <h4 className="text-md font-black uppercase tracking-widest mb-10 text-center text-gray-400">BHK Breakdown</h4>
                                    <div className="h-[250px] w-full relative">
                                        <canvas id="chart-bhk-dist"></canvas>
                                    </div>
                                    <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                                        {Object.entries(liveData.summary.bhk_distribution).slice(0, 4).map(([k, v]: any) => (
                                            <div key={k} className="p-4 bg-gray-50 rounded-2xl flex justify-between border border-gray-100/50">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{k} BHK</span>
                                                <span className="text-xs font-black text-gray-900">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="space-y-12">
                            <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-8">
                                {/* Premium Localities */}
                                <div className="p-10 border border-gray-100 rounded-[3rem] space-y-8 bg-gradient-to-br from-indigo-50/50 to-white">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Premium Market Hubs</h3>
                                    <div className="space-y-4">
                                        {(liveData?.locality_stats || []).sort((a:any, b:any) => b.rent - a.rent).slice(0, 11).map((loc: any, i: number) => (
                                            <button 
                                                key={i} 
                                                onClick={() => {setSelectedLocality(loc.locality); setActiveTab('inventory'); setGridSearch(loc.locality)}}
                                                className="w-full flex justify-between items-center group text-left p-2 hover:bg-white rounded-xl transition-all"
                                            >
                                                <div>
                                                    <div className="font-black text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">{loc.locality}</div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{Math.round(loc.rent).toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-sans font-black text-lg text-gray-900">{(loc.rent_psf / (liveData?.summary?.avg_rent_psf || 1) * 1.2).toFixed(1)}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Value Localities */}
                                <div className="p-10 border border-gray-100 rounded-[3rem] space-y-8 bg-gradient-to-br from-emerald-50/30 to-white">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Budget-Friendly Zones</h3>
                                    <div className="space-y-4">
                                        {(liveData?.locality_stats || []).sort((a:any, b:any) => a.rent - b.rent).slice(0, 11).map((loc: any, i: number) => (
                                            <button 
                                                key={i} 
                                                onClick={() => {setSelectedLocality(loc.locality); setActiveTab('inventory'); setGridSearch(loc.locality)}}
                                                className="w-full flex justify-between items-center group text-left p-2 hover:bg-white rounded-xl transition-all"
                                            >
                                                <div>
                                                    <div className="font-black text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">{loc.locality}</div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{Math.round(loc.rent).toLocaleString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Value</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Yield Score */}
                                <div className="p-10 bg-gray-900 rounded-[3rem] text-white">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8">Yield Score Ranking</h3>
                                    <div className="space-y-6">
                                        {(liveData?.summary?.best_investment_areas || []).slice(0, 11).map((area: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="text-xl font-black text-white/20 w-8">#{i+1}</div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-black text-white/80">{area.locality}</span>
                                                        <span className="text-[10px] font-bold text-white/40">{area.investment_score}/10</span>
                                                    </div>
                                                    <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${area.investment_score * 10}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            <div className="p-12 border border-gray-100 rounded-[3rem] bg-white">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-12">Locality-Wise Amenity Impact</h3>
                                <div className="grid grid-cols-2 gap-x-24 gap-y-12">
                                    {Object.entries(liveData?.amenity_impact || {}).map(([key, list]: any, i: number) => (
                                        <div key={i} className="space-y-6">
                                            <h5 className="font-black text-xs uppercase tracking-widest text-indigo-700 bg-indigo-50 p-3 rounded-xl inline-block border border-indigo-100">{key} Insight</h5>
                                            <div className="space-y-4">
                                                {list.map((item: any, idx: number) => (
                                                    <div key={idx} className="p-5 border border-gray-50 bg-white rounded-2xl hover:shadow-md transition-all group">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-[12px] font-black text-gray-900">{item.locality}</span>
                                                            <span className="text-[12px] font-black text-emerald-600">+₹{item.premium.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            <span>Premium Option: ₹{item.with.toLocaleString()}</span>
                                                            <span>Standard Option: ₹{item.without.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'inventory' && (
                        <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Raw Market Inventory (Balanced across 11 Locations)</h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        id="inventory-search-input"
                                        type="text" 
                                        placeholder="Search Locality, Size or Rent..."
                                        className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-900 outline-none focus:border-indigo-600 transition-all w-96 shadow-sm"
                                        value={gridSearch}
                                        onChange={(e) => setGridSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="border border-gray-100 rounded-[2.5rem] bg-white shadow-xl shadow-gray-200/20 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-[11px] font-black uppercase tracking-widest text-indigo-600">
                                                <th className="p-8 text-left">Locality</th>
                                                <th className="p-8 text-left">Monthly Rent</th>
                                                <th className="p-8">Config</th>
                                                <th className="p-8">Floor (F/T)</th>
                                                <th className="p-8">Size</th>
                                                <th className="p-8">Lease Type</th>
                                                <th className="p-8">Age (Y)</th>
                                                <th className="p-8">Furnishing</th>
                                                <th className="p-8">Amenities</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredRows.slice(0, 500).map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                                                    <td className="p-8 font-black text-gray-900 text-sm">{row.locality}</td>
                                                    <td className="p-8 font-black text-indigo-600 text-sm">₹{row.rent.toLocaleString()}</td>
                                                    <td className="p-8 font-bold text-gray-500 text-xs">{row.type_display}</td>
                                                    <td className="p-8 font-bold text-gray-400 text-xs">{row.floor_info}</td>
                                                    <td className="p-8 font-bold text-gray-900 text-sm">{row.property_size}</td>
                                                    <td className="p-8 font-bold text-gray-400 text-[10px] uppercase">{row.lease_type}</td>
                                                    <td className="p-8 font-bold text-gray-900 text-sm">{row.property_age}</td>
                                                    <td className="p-8">
                                                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                            {row.furnishing_display}
                                                        </span>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex justify-center gap-2">
                                                            {row.gym && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_5px_rgba(99,102,241,0.8)]" title="Gym" />}
                                                            {row.swimming_pool && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)]" title="Pool" />}
                                                            {row.lift && <div className="w-1.5 h-1.5 bg-white/20 rounded-full" title="Lift" />}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AnalyticsPage
