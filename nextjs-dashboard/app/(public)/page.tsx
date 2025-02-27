import { getBrandConfig } from '@/app/lib/brand/service'
import { HeroSection } from '@/components/landing/HeroSection'
import { PromoSection } from '@/components/landing/PromoSection'
import { CategoriesSection } from '@/components/landing/CategoriesSection'
import { ContactSection } from '@/components/landing/ContactSection'
import { Confetti } from '@/components/landing/Confetti'

export default function Page() {
  const config = getBrandConfig()

  return (
    <main className="flex min-h-screen flex-col">
      <Confetti 
        colors={[
          config.colors.primary, 
          config.colors.secondary, 
          config.colors.accent
        ]} 
      />
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
