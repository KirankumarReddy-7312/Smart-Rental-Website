'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  HomeModernIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    // Handle different link types
    switch(href) {
      case '/properties':
        window.dispatchEvent(new CustomEvent('open-search'))
        break
      case '/contact':
        alert('Contact us at: contact@rentora.com | Phone: +91 98765 43210')
        break
      case '/owner/register':
        alert('Register Property: List your property with us! Email: owner@rentora.com | Phone: +91 98765 43210')
        break
      case '/calculator':
        alert('Rent Calculator: Calculate your monthly rent and deposit requirements.')
        break
      case '/alerts':
        alert('Property Alerts: Get notified when new properties match your criteria!')
        break
      case '/help':
        alert('Help Center: How can we assist you today? Email: help@rentora.com')
        break
      case '/safety':
        alert('Safety: Your safety is our priority. Read our safety guidelines.')
        break
      case '/terms':
        alert('Terms of Service: By using Rentora, you agree to our terms and conditions.')
        break
      case '/privacy':
        alert('Privacy Policy: We respect your privacy and protect your data.')
        break
      default:
        // For existing pages, navigate normally
        window.location.href = href
    }
  }

  const footerLinks = {
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Register Property', href: '/owner/register' },
    ],
    Services: [
      { name: 'Property Search', href: '/properties' },
      { name: 'Location Guide', href: '/locations' },
      { name: 'Rent Calculator', href: '/calculator' },
      { name: 'Property Alerts', href: '/alerts' },
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety', href: '/safety' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center space-x-2 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <HomeModernIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold font-serif tracking-widest text-primary-400">Rentora</span>
            </motion.div>
            
            <motion.p
              className="text-gray-300 mb-6 max-w-md"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Find your perfect rental home in Bangalore with our smart property search platform. 
              We make house hunting simple, transparent, and efficient.
            </motion.p>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="w-5 h-5 text-primary-400" />
                <span>+91 80 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                <span>info@rentora.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPinIcon className="w-5 h-5 text-primary-400" />
                <span>Bangalore, Karnataka 560001</span>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={(e) => handleLinkClick(link.href, e)}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <motion.p
              className="text-gray-400 text-sm mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              © 2024 Rentora. All rights reserved. Banglore, Karnataka.
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
