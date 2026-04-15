'use client'

import { motion } from 'framer-motion'
import { 
  BuildingOfficeIcon,
  UsersIcon,
  ShieldCheckIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const AboutPage = () => {
  const team = [
    {
      name: 'K. Indu',
      linkedin: 'https://www.linkedin.com/in/l-kirankumar-reddy/'
    },
    {
      name: 'Kirankumar Reddy',
      linkedin: 'https://www.linkedin.com/in/l-kirankumar-reddy/'
    },
    {
      name: 'Venkata Lahari Katakam',
      linkedin: 'https://www.linkedin.com/in/katakamlahari/'
    },
    {
      name: 'Y. Bhuvana',
      linkedin: 'https://www.linkedin.com/in/yellamarajugari-bhuvana-678495357'
    },
    {
      name: 'M. Vinay',
      linkedin: 'https://www.linkedin.com/in/vinay-masagani-255958317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    },
    {
      name: 'C. Harshitha',
      linkedin: 'https://www.linkedin.com/in/cheruku-harshitha-ab098b357'
    },
    {
      name: 'T. Venu',
      linkedin: 'https://www.linkedin.com/in/thanneru-venu-madhava-reddy-9436b2320/'
    },
    {
      name: 'E. Sumasree',
      linkedin: 'https://www.linkedin.com/in/sumasree-emmadi-a1a980357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    },
    {
      name: 'M. Vamsi',
      linkedin: 'https://www.linkedin.com/in/vamsi-vardhan09/'
    },
    {
      name: 'R. Sai Ganesh',
      linkedin: 'https://www.linkedin.com/in/rajput-saiganesh-5bb367392?utm_source=share_via&utm_content=profile&utm_medium=member_android'
    }
  ]

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency in property listings and pricing'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'Your satisfaction is our priority, we go extra mile to help you'
    },
    {
      icon: SparklesIcon,
      title: 'Innovation',
      description: 'Constantly improving our platform with latest technology'
    },
    {
      icon: GlobeAltIcon,
      title: 'Local Expertise',
      description: 'Deep understanding of Bangalore real estate market'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About Rentora
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Making rental property search in Bangalore simple, transparent, and delightful
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Rentora was founded by a group of passionate individuals who believed that the rental experience in Bangalore could be significantly improved through technology and a human-centric approach.
                </p>
                <p>
                  Our team brings together diverse expertise in real estate, technology, and customer service. We work tirelessly to ensure that every listing on our platform is accurate and that every user receives the support they need.
                </p>
                <p>
                  From humble beginnings to becoming one of Bangalore's most preferred rental platforms, our journey has always been about putting people first. We are committed to building a community where finding a home is a joy, not a chore.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[450px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white">
                <img 
                  src="/team-group.jpg" 
                  alt="Rentora Core Team"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-3xl font-black mb-2 flex items-center">
                    <UsersIcon className="w-8 h-8 mr-2 text-yellow-400" />
                    The Rentora Team
                  </p>
                  <p className="text-sm font-bold uppercase tracking-widest text-primary-100 italic">Driven by Innovation & Passion</p>
                </div>
              </div>
              
              {/* Floating Badge Removed as per request */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Properties Listed' },
              { number: '5,000+', label: 'Happy Tenants' },
              { number: '8', label: 'Bangalore Areas' },
              { number: '4.8/5', label: 'User Rating' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team Next Minds</h2>
            <p className="text-xl text-gray-600">
              The passionate professionals behind Rentora's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <UsersIcon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{member.name}</h3>
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-bold text-xs uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full transition-all hover:bg-primary-100"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.025-3.059-1.865-3.059-1.865 0-2.152 1.455-2.152 2.962v5.701h-3v-11h2.882v1.503h.04c.401-.759 1.381-1.558 2.844-1.558 3.041 0 3.601 2.002 3.601 4.604v6.451z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
