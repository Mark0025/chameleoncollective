'use client'

import { lusitana } from '@/app/ui/fonts'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getBrandConfig } from '@/app/lib/brand/service'
import { UserButton } from '@clerk/nextjs'

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    async function loadConfig() {
      const brandConfig = await getBrandConfig()
      setConfig(brandConfig)
    }
    loadConfig()
  }, [])

  if (!config) return null

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-[#235082] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className={`${lusitana.className} text-2xl font-bold`}>
              {config.brand.name}
            </h1>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-[#235082]/80">
                Dashboard
              </Button>
            </Link>
            <Link href="/rentals">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-[#235082]/80">
                Rentals
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-[#235082]/80">
                Contact
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto py-8">
          {/* Booking Header */}
          <div className="mb-8 text-center">
            <h1 className={`${lusitana.className} text-4xl font-bold text-[#2C363F] mb-4`}>
              Book Your Event
            </h1>
            <p className="text-lg text-[#2C363F]/80">
              Select your items and schedule your rental
            </p>
          </div>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#235082] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`${lusitana.className} text-xl font-bold mb-4`}>Contact Us</h3>
              <p>{config.brand.phone.primary}</p>
              <p>{config.brand.email}</p>
            </div>
            <div>
              <h3 className={`${lusitana.className} text-xl font-bold mb-4`}>Business Hours</h3>
              <p>Weekdays: {config.brand.hours.weekday}</p>
              <p>Saturday: {config.brand.hours.saturday}</p>
              <p>Sunday: {config.brand.hours.sunday}</p>
            </div>
            <div>
              <h3 className={`${lusitana.className} text-xl font-bold mb-4`}>Follow Us</h3>
              <div className="flex gap-4">
                {config.social?.facebook && (
                  <Link href={`https://facebook.com/${config.social.facebook}`} target="_blank" className="hover:text-[#FF6B6B]">
                    Facebook
                  </Link>
                )}
                {config.social?.instagram && (
                  <Link href={`https://instagram.com/${config.social.instagram}`} target="_blank" className="hover:text-[#FF6B6B]">
                    Instagram
                  </Link>
                )}
                {config.social?.twitter && (
                  <Link href={`https://twitter.com/${config.social.twitter}`} target="_blank" className="hover:text-[#FF6B6B]">
                    Twitter
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 