'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import ProductSearch from "./ProductSearch"

export default function DashboardContent({ firstName }: { firstName: string }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#2C363F]">Welcome, {firstName}!</h1>
        <SignOutButton>
          <Button variant="outline" className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white">
            Sign Out
          </Button>
        </SignOutButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#235082]">
          <CardHeader>
            <CardTitle className="text-[#235082]">My Rentals</CardTitle>
            <CardDescription>View your current and past rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#2C363F]">No active rentals</p>
          </CardContent>
        </Card>

        <Card className="border-[#235082]">
          <CardHeader>
            <CardTitle className="text-[#235082]">Upcoming Events</CardTitle>
            <CardDescription>Your scheduled events and reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#2C363F]">No upcoming events</p>
          </CardContent>
        </Card>

        <Card className="border-[#235082]">
          <CardHeader>
            <CardTitle className="text-[#235082]">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-[#2C363F]">• Browse available rentals</p>
            <p className="text-sm text-[#2C363F]">• Make a reservation</p>
            <p className="text-sm text-[#2C363F]">• Contact support</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#2C363F] mb-6">Available Products</h2>
        <ProductSearch />
      </div>
    </div>
  )
} 