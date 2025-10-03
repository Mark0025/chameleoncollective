'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Failed to sign up. Please try again.')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

            {/* Email Signup Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-full bg-gray-800 text-white border-2 border-gray-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? 'Submitting...' : 'Notify Me'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Be the first to know when we launch!
                </p>
              </form>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-2xl font-bold text-green-600">🎉 Welcome to the Hive!</p>
                <p className="text-gray-600">We'll buzz you when we launch!</p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 w-full max-w-md mx-auto">
              <div className="flex-1 h-px bg-amber-200"></div>
              <span className="text-amber-600 text-sm">or</span>
              <div className="flex-1 h-px bg-amber-200"></div>
            </div>

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
