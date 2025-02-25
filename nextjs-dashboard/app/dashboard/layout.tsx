'use client'

import { lusitana } from '@/app/ui/fonts'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import type { UserMetadata } from '@/types/user'
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [notifications, setNotifications] = useState({
    events: 0,
    rentals: 0
  })

  useEffect(() => {
    if (user?.publicMetadata) {
      const metadata = user.publicMetadata as unknown as UserMetadata
      setIsAdmin(metadata.role === 'admin')
      
      // In a real app, this would be an API call to get actual counts
      // This is just for demonstration
      setNotifications({
        events: 2, // Example: 2 upcoming events
        rentals: 1  // Example: 1 active rental
      })
    }
  }, [user])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#235082] text-white p-6">
        <div className="mb-8">
          <Link href="/">
            <h1 className={`${lusitana.className} text-2xl font-bold`}>
              Amanda's Rentals
            </h1>
          </Link>
        </div>
        
        <nav className="space-y-4">
          <Link href="/dashboard" className="block">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/rentals" className="block relative">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
              My Rentals
              {notifications.rentals > 0 && (
                <Badge variant="secondary" className="ml-2 bg-[#FF6B6B]">
                  {notifications.rentals}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/dashboard/events" className="block relative">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
              My Events
              {notifications.events > 0 && (
                <Badge variant="secondary" className="ml-2 bg-[#FF6B6B]">
                  {notifications.events}
                </Badge>
              )}
            </Button>
          </Link>

          {isAdmin && (
            <>
              <div className="border-t border-white/20 my-4 pt-4">
                <h2 className="text-sm font-semibold text-white/60 px-3 mb-2">Admin</h2>
              </div>
              <Link href="/admin/events" className="block">
                <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
                  All Events
                </Button>
              </Link>
              <Link href="/admin/products" className="block">
                <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/inventory" className="block">
                <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
                  Inventory
                </Button>
              </Link>
              <Link href="/admin/settings" className="block">
                <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#235082]/80">
                  Settings
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </div>
    </div>
  )
}