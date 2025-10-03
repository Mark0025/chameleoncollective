import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Bee Animation Container */}
        <div className="relative h-40 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🐝</div>
          </div>
          {/* Honeycomb Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <pattern id="honeycomb" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="#FFA500" stroke="#FF8C00" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#honeycomb)"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-amber-900 tracking-tight">
            HiveMarketOK
          </h1>
          <p className="text-2xl text-amber-700 font-medium">
            Your Community Marketplace
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 border-amber-200 space-y-6">
            <p className="text-xl text-gray-700">
              🍯 Cute Boutique Party Supplies
            </p>
            <p className="text-3xl font-bold text-amber-600">
              Available Soon!
            </p>
            <p className="text-gray-600">
              We're buzzing with excitement to bring you the sweetest party supplies in Oklahoma
            </p>

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              Enter the Hive →
            </Link>
          </div>

          {/* Floating Bees */}
          <div className="flex justify-center gap-8 text-4xl">
            <span className="animate-pulse">🐝</span>
            <span className="animate-pulse delay-100">🐝</span>
            <span className="animate-pulse delay-200">🐝</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-amber-600">
          Mustang, OK • info@hivemarketok.com • 405-314-5387
        </p>
      </div>
    </div>
  )
}
