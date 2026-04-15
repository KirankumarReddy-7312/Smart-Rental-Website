'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UserIcon, 
  UsersIcon,
  HomeModernIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdminPage = () => {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const role = localStorage.getItem('userRole')
    
    if (!isLoggedIn || role !== 'admin') {
      router.push('/login')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    window.dispatchEvent(new Event('storage'))
    toast.success('Admin logout successful')
    router.push('/')
  }

  const [realTimeUsers, setRealTimeUsers] = useState<any[]>([])

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    setRealTimeUsers(allUsers)
  }, [])

  const filteredUsers = realTimeUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col shadow-sm pt-8">
          <div className="px-8 mb-10">
             <div className="p-5 bg-primary-600 rounded-[2rem] text-white shadow-xl shadow-primary-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider">Admin Portal</h3>
                    <p className="text-[10px] font-bold text-primary-100">Superuser Access</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full bg-yellow-400 font-black text-primary-900 flex items-center justify-center text-xs">A</div>
                   <p className="text-xs font-bold truncate">{user.name}</p>
                </div>
             </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
             {[
               { id: 'users', name: 'Dashboard', icon: UsersIcon, href: '/admin' },
             ].map((item) => (
               <Link
                 key={item.id}
                 href={item.href}
                 className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-black transition-all ${
                   activeTab === item.id 
                   ? 'bg-gray-900 text-white shadow-2xl' 
                   : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                 }`}
               >
                 <item.icon className="w-5 h-5" />
                 <span className="text-sm uppercase tracking-widest">{item.name}</span>
               </Link>
             ))}
          </nav>

          <div className="p-6 border-t border-gray-50">
             {/* Terminate Session Removed as per request */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-primary-600 font-black text-xs uppercase tracking-[0.4em] mb-4"
                >
                  System Management
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-black text-gray-900 font-serif"
                >
                  Platform <br />
                  <span className="text-primary-600 italic">User Profiles</span>
                </motion.h1>
              </div>

              <div className="flex items-center space-x-4">
                 <div className="relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-gray-100 rounded-3xl pl-12 pr-6 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary-500 outline-none w-64 md:w-80 transition-all"
                    />
                 </div>
                 <button className="p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all text-gray-400">
                    <FunnelIcon className="w-6 h-6" />
                 </button>
              </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {[
                 { label: 'Total Tenants', count: realTimeUsers.filter(u => u.role === 'Tenant').length.toLocaleString(), color: 'border-b-blue-500' },
                 { label: 'Total Owners', count: realTimeUsers.filter(u => u.role === 'Owner').length.toLocaleString(), color: 'border-b-indigo-500' },
                 { label: 'Live Sessions', count: (realTimeUsers.filter(u => u.status === 'Logged In').length + 1).toLocaleString(), color: 'border-b-emerald-500' },
               ].map((stat, i) => (
                 <div key={i} className={`bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 border-b-4 ${stat.color}`}>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                   <p className="text-4xl font-black text-gray-900">{stat.count}</p>
                 </div>
               ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                       <th className="px-8 py-6">User / Profile</th>
                       <th className="px-8 py-6">Role</th>
                       <th className="px-8 py-6">Status</th>
                       <th className="px-8 py-6">Joined Date</th>
                       <th className="px-8 py-6">Contact</th>
                       <th className="px-8 py-6 text-center">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {filteredUsers.length > 0 ? (
                       filteredUsers.map((u) => (
                         <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center font-black text-primary-600 text-lg shadow-inner">
                                    {u.name?.charAt(0) || 'U'}
                                 </div>
                                 <div>
                                    <p className="font-black text-gray-900 text-sm">{u.name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                u.role === 'Owner' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                 {u.role}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-2">
                                 <div className={`w-2 h-2 rounded-full ${
                                   u.status === 'Logged In' ? 'bg-emerald-500 animate-pulse' : 
                                   u.status === 'Active' ? 'bg-emerald-400' : 
                                   u.status === 'Away' ? 'bg-yellow-400' : 'bg-gray-300'
                                 }`} />
                                 <span className="text-xs font-bold text-gray-700">{u.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-xs font-bold text-gray-600">{u.joined}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{u.location}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-3 text-gray-400">
                                 <EnvelopeIcon className="w-4 h-4 hover:text-primary-600 cursor-pointer" />
                                 <PhoneIcon className="w-4 h-4 hover:text-primary-600 cursor-pointer" />
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                 <EllipsisVerticalIcon className="w-5 h-5" />
                              </button>
                           </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={6} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                               <UsersIcon className="w-12 h-12 mb-4 opacity-20" />
                               <p className="font-black uppercase tracking-widest text-xs">No users registered yet</p>
                               <p className="text-[10px] font-medium mt-1">Real-time data will appear here as users sign up.</p>
                            </div>
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPage
