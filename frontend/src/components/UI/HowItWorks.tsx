'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ElementType
  color: string
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      id: 1,
      title: 'Search Properties',
      description: 'Use our smart search filters to find the perfect rental home that matches your budget, location, and preferences.',
      icon: MagnifyingGlassIcon,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Save Favorites',
      description: 'Save properties you love to your wishlist and compare them side by side to make the best decision.',
      icon: HeartIcon,
      color: 'bg-red-500'
    },
    {
      id: 3,
      title: 'Get Your Keys',
      description: 'Connect with property owners, schedule visits, and complete the rental process seamlessly.',
      icon: KeyIcon,
      color: 'bg-green-500'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Rentora Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Finding your dream rental home is simple with our three-step process. 
            From search to move-in, we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {step.id}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full card-hover">
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connection Line (for desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-primary-400"></div>
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Find Your Perfect Home?
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of happy renters who found their dream homes through Rentora. 
              Start your search today!
            </p>
            <Link
              href="/properties"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              Start Searching Now
            </Link>

          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
