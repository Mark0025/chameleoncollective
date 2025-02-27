'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { getBrandConfig } from '@/app/lib/brand/service'
import { HeroSection } from '@/components/landing/HeroSection'
import { PromoSection } from '@/components/landing/PromoSection'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { ContactSection } from '@/components/landing/ContactSection'

// Dynamically import react-confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
})

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth()
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  const config = getBrandConfig()

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

      <HeroSection 
        brandName={config.brand.name}
        brandSlogan={config.brand.slogan}
      />
      <PromoSection />
      <CategoriesSection />
      <ContactSection phoneNumber={config.brand.phone.primary} />
    </main>
  )
}
