'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Message sent! Our "Happy Team" will contact you soon.', {
        icon: '🚀',
        style: {
          borderRadius: '15px',
          background: '#1e293b',
          color: '#fff',
        }
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-600 font-bold text-xs uppercase tracking-widest mb-6"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Connect With Us
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Always Here for Our <br />
            <span className="text-primary-600 italic">"Happy Users"</span>
          </motion.h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Have questions about a property or need help with your search? 
            Our Bangalore-based team is ready to help you find your dream home.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-500 mb-2">Detailed inquiries or feedback</p>
                  <p className="text-primary-600 font-black">info@rentora.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-500 mb-2">Mon-Sat, 9am to 6pm IST</p>
                  <p className="text-primary-600 font-black">+91 80 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Visit Office</h3>
                  <p className="text-gray-500 mb-2">Algonex IT Solutions</p>
                  <p className="text-gray-900 font-bold">Marathahalli, Bangalore</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
               <ChatBubbleBottomCenterTextIcon className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
               <h3 className="text-2xl font-black mb-4">Quick Support</h3>
               <p className="text-primary-50 opacity-90 leading-relaxed font-medium">
                 Looking for immediate assistance? Chat with our experts in the dashboard for real-time property insights and priority viewing schedules.
               </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                      placeholder="Kiran"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                      placeholder="kiran@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary-500 focus:bg-white outline-none transition-all font-bold text-gray-700 resize-none"
                    placeholder="Tell us everything..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl hover:bg-primary-700 transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message To Team'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
