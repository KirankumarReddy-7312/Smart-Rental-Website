import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import HappyUserBanner from '@/components/UI/HappyUserBanner'
import LogoIntro from '@/components/UI/LogoIntro'
import ChatBot from '@/components/Chat/ChatBot'
import ClientOnly from '@/components/Layout/ClientOnly'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rentora - Smart Rental Finder for Bangalore',
  description: 'Find your perfect rental home in Bangalore with our smart property search platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnly>
          <LogoIntro />
        </ClientOnly>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <HappyUserBanner />
        <ChatBot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
