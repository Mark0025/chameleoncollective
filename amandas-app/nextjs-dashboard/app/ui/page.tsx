import { PromoSection } from '@/components/landing/PromoSection'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { ContactWrapper } from '@/components/landing/client/ContactWrapper'
import { getBrandConfig } from '@/app/lib/brand/config'

export default function Page() {
  const config = getBrandConfig()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Bee Animation */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 overflow-hidden">
        {/* Bee Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-9xl animate-bounce">🐝</div>
        </div>

        {/* Honeycomb Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="honeycomb-hero" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="#FFA500" stroke="#FF8C00" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#honeycomb-hero)"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-6xl md:text-7xl font-bold text-amber-900 tracking-tight">
            HiveMarket
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-amber-700">
            Party & Event Rentals
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Your Community Marketplace for boutique party supplies and event rentals in Oklahoma
          </p>
          <div className="flex justify-center gap-8 text-4xl mt-8">
            <span className="animate-pulse">🐝</span>
            <span className="animate-pulse delay-100">🐝</span>
            <span className="animate-pulse delay-200">🐝</span>
          </div>
        </div>
      </section>

      <PromoSection />
      <CategoriesSection />
      <ContactWrapper phoneNumber={config.brand.phone.primary} />
    </main>
  )
}