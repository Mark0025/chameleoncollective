'use client'

import { getBrandConfig } from '@/app/lib/brand/service'

export default function AmandaLogo() {
  const config = getBrandConfig()

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-[#235082] text-white px-4 py-2 rounded-lg font-bold text-lg">
        A
      </div>
    </div>
  )
}
