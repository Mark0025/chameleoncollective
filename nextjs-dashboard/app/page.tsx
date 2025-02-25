'use client'

import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { getBrandConfig } from '@/app/lib/brand/service'
import { BookButton } from '@/components/booking/BookButton'

// Dynamically import react-confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
})

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)
  const [config, setConfig] = useState<any>(null)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    async function loadConfig() {
      const brandConfig = await getBrandConfig()
      setConfig(brandConfig)
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)

    // Hide confetti after 4 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 4000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  if (!config) return null // Wait for config to load

  return (
    <main className="flex min-h-screen flex-col">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={[config.colors.primary, config.colors.secondary, config.colors.accent]}
        />
      )}

      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center bg-[#FF6B6B]/10">
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className={`${lusitana.className} text-4xl sm:text-6xl font-bold text-[#2C363F] mb-6`}>
            {config.brand.name}
          </h1>
          <p className="text-xl sm:text-2xl text-[#2C363F] mb-8">
            {config.brand.slogan}
          </p>
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-4 justify-center items-center">
              <SignedIn>
                <Button
                  asChild
                  className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white px-8 py-3 rounded-lg text-lg"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <Button
                  asChild
                  className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white px-8 py-3 rounded-lg text-lg"
                >
                  <Link href="/rentals">Browse Rentals</Link>
                </Button>
              </SignedOut>
              <Button
                asChild
                variant="outline"
                className="bg-white hover:bg-gray-50 text-[#2C363F] px-8 py-3 rounded-lg text-lg"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="bg-white hover:bg-gray-50">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
            <div className="flex justify-center">
              <BookButton />
            </div>
          </div>
        </div>
      </div>

      {/* Promo Image Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-[#FF6B6B]">
            <Image
              src="/images/marketing/amanda-promo.jpg"
              alt="Amanda's Party & Event Rentals Team"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className={`${lusitana.className} text-2xl text-[#2C363F] mb-4`}>
            Family-Owned & Operated
          </p>
          <p className="text-lg text-[#2C363F] opacity-80">
            Creating memorable events with a personal touch
          </p>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className={`${lusitana.className} text-3xl font-bold text-center mb-12 text-[#2C363F]`}>
          Our Rental Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Trailers</CardTitle>
              <CardDescription>Various sizes for your transportation needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full">
                <Image
                  src="/images/product-imgs/trailers/small-trailer.png"
                  alt="Rental trailers"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tables</CardTitle>
              <CardDescription>6ft tables perfect for any event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full">
                <Image
                  src="/images/product-imgs/table.jpg"
                  alt="Rental tables"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chairs</CardTitle>
              <CardDescription>Comfortable seating options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full">
                <Image
                  src="/images/product-imgs/chair.jpg"
                  alt="Rental chairs"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Party Supplies</CardTitle>
              <CardDescription>High-quality balloons and decorations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full">
                <Image
                  src="/images/product-imgs/ballons.jpg"
                  alt="Party supplies"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#4ECDC4]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`${lusitana.className} text-3xl font-bold mb-6 text-[#2C363F]`}>
            Ready to Make Your Event Special?
          </h2>
          <p className="text-lg mb-8 text-[#2C363F]">
            Contact us today at {config.brand.phone.primary} or visit our showroom
          </p>
          <Button
            asChild
            className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white px-8 py-3 rounded-lg text-lg"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
