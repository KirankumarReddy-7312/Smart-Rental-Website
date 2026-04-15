'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon, 
  HomeModernIcon, 
  MapPinIcon, 
  InformationCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showJoinSelection, setShowJoinSelection] = useState(false)

  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
      setUserRole(localStorage.getItem('userRole'))
    }
    checkLogin()
    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    window.dispatchEvent(new Event('storage'))
    window.location.href = '/'
  }

  const shouldBeDarkText = isScrolled || !isHomePage

  const navigation = isLoggedIn 
    ? (userRole === 'admin' 
        ? [
            { name: 'Properties', href: '/properties', icon: HomeModernIcon },
            { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
          ]
        : [
            { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
            { name: 'Properties', href: '/properties', icon: HomeModernIcon },
          ]
      )
    : [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Properties', href: '/properties', icon: HomeModernIcon },
        { name: 'About', href: '/about', icon: InformationCircleIcon },
        { name: 'Contact', href: '/contact', icon: MapPinIcon },
      ]

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          shouldBeDarkText 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <HomeModernIcon className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className={`text-2xl font-extrabold tracking-widest leading-none font-serif ${
                  shouldBeDarkText ? 'text-gray-900' : 'text-white'
                }`}>
                  Rentora
                </span>
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${
                  shouldBeDarkText ? 'text-primary-600' : 'text-white/60'
                }`}>
                  Smart Rental Finder
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    shouldBeDarkText
                      ? 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                      : 'text-white hover:text-white hover:bg-white/10'
                  } ${pathname === item.href ? (shouldBeDarkText ? 'bg-gray-100 text-primary-600' : 'bg-white/20') : ''}`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                   <Link
                     href={userRole === 'admin' ? '/admin' : '/dashboard'}
                     className={`flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:bg-black active:scale-95`}
                   >
                     <UserIcon className="w-4 h-4" />
                     <span>{userRole === 'admin' ? 'Dashboard' : 'Dashboard'}</span>
                   </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:bg-black active:scale-95`}
                  >
                    <span>Login</span>
                  </Link>
                  <button
                    onClick={() => setShowJoinSelection(true)}
                    className="px-8 py-4 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all active:scale-95"
                  >
                    Join Now
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${
                  shouldBeDarkText ? 'text-gray-700' : 'text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={`px-2 pt-2 pb-3 space-y-1 rounded-lg ${
                shouldBeDarkText ? 'bg-white' : 'bg-white/95'
              }`}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setShowJoinSelection(true)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 mt-2"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Join Now Selection Modal */}
      <AnimatePresence>
        {showJoinSelection && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinSelection(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 p-6 z-10">
                <button onClick={() => setShowJoinSelection(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar pr-2">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black text-gray-900 mb-2 font-serif">Welcome to Rentora</h2>
                  <p className="text-gray-500 font-medium">Please select your account type to continue</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  <Link
                    href="/register"
                    onClick={() => setShowJoinSelection(false)}
                    className="group p-6 md:p-8 rounded-[2.5rem] border-2 border-gray-100 hover:border-primary-500 transition-all text-center hover:shadow-2xl hover:shadow-primary-100"
                  >
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <UserIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">I am a Tenant</h3>
                    <p className="text-sm text-gray-500 font-medium italic">Searching for my perfect home</p>
                  </Link>

                  <Link
                    href="/owner/register"
                    onClick={() => setShowJoinSelection(false)}
                    className="group p-6 md:p-8 rounded-[2.5rem] border-2 border-gray-100 hover:border-indigo-500 transition-all text-center hover:shadow-2xl hover:shadow-indigo-100"
                  >
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <HomeModernIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">I am an Owner</h3>
                    <p className="text-sm text-gray-500 font-medium italic">Listing my premium property</p>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
