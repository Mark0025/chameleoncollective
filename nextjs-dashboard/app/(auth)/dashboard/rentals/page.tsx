'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import Image from 'next/image'
import { CalendarDays, ArrowRight, Clock } from 'lucide-react'
import type { UserMetadata } from '@/types/user'

// Sample rental data - this would come from your database
const MARK_RENTALS = [
  {
    id: 1,
    itemName: "16ft Tandem Axle Trailer",
    image: "/images/product-imgs/trailers/16ft-tandem-axel.png",
    startDate: new Date(2024, 1, 24),
    endDate: new Date(2024, 1, 26),
    status: "active",
    price: 75.00,
    rentalDays: 2,
    itemId: "trailer-001"
  }
]

interface RentalStatus {
  active: string;
  upcoming: string;
  completed: string;
  overdue: string;
}

const STATUS_COLORS: RentalStatus = {
  active: "bg-green-100 text-green-800",
  upcoming: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  overdue: "bg-red-100 text-red-800"
}

export default function RentalsPage() {
  const { user } = useUser()
  const [userType, setUserType] = useState<'guest' | 'user' | 'admin'>('guest')
  const [rentals, setRentals] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would be an API call
    if (user) {
      // Check if the user is Mark Carpenter (for demo purposes)
      if (user.emailAddresses[0]?.emailAddress === 'mark.carpenter@example.com') {
        setRentals(MARK_RENTALS)
      }
      
      // Set user type based on metadata
      if (user.publicMetadata) {
        const metadata = user.publicMetadata as unknown as UserMetadata
        if (metadata.role === 'admin') {
          setUserType('admin')
        } else {
          setUserType('user')
        }
      } else {
        setUserType('user')
      }
    } else {
      setUserType('guest')
    }
  }, [user])

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  const calculateTimeLeft = (end: Date) => {
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days left` : 'Due today'
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C363F]">My Rentals</h1>
          <p className="text-[#2C363F]/60">
            {userType === 'guest' 
              ? 'Sign in to view your rentals'
              : 'View and manage your current rentals'}
          </p>
        </div>
        <Button className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
          Browse Available Items
        </Button>
      </div>

      {userType === 'guest' ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              Please sign in to view your rentals
            </p>
            <Button className="bg-[#235082] hover:bg-[#235082]/90">
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : rentals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              You don't have any active rentals
            </p>
            <Button className="bg-[#235082] hover:bg-[#235082]/90">
              Browse Items
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardContent className="flex gap-6 p-6">
                <div className="relative h-48 w-48 flex-shrink-0">
                  <Image
                    src={rental.image}
                    alt={rental.itemName}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2C363F]">
                        {rental.itemName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>{formatDateRange(rental.startDate, rental.endDate)}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[rental.status as keyof RentalStatus]}`}>
                      {rental.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Daily Rate</p>
                      <p className="text-lg font-semibold">${rental.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Days</p>
                      <p className="text-lg font-semibold">{rental.rentalDays}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Cost</p>
                      <p className="text-lg font-semibold">${(rental.price * rental.rentalDays).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-[#FF6B6B]">
                      <Clock className="w-4 h-4 mr-2" />
                      {calculateTimeLeft(rental.endDate)}
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Extend Rental</Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rental History Section */}
      {userType !== 'guest' && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#2C363F] mb-6">Rental History</h2>
          <Card>
            <CardHeader>
              <CardTitle>Previous Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No previous rentals found</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 