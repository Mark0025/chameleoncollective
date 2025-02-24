'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import Link from 'next/link'
import { CalendarIcon, ListIcon, Plus } from 'lucide-react'
import type { UserMetadata } from '@/types/user'

// Sample events data - this would come from your database
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Wedding Reception",
    date: new Date(2024, 1, 28),
    type: "wedding",
    status: "confirmed",
    items: ["Tables", "Chairs", "Arch"]
  },
  {
    id: 2,
    title: "Corporate Meeting",
    date: new Date(2024, 2, 5),
    type: "corporate",
    status: "pending",
    items: ["Projector", "Tables", "Chairs"]
  }
]

export default function EventsPage() {
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (user?.publicMetadata) {
      const metadata = user.publicMetadata as unknown as UserMetadata
      setIsAdmin(metadata.role === 'admin')
    }
  }, [user])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C363F]">Events</h1>
          <p className="text-[#2C363F]/60">
            {isAdmin ? 'Manage all scheduled events' : 'View your scheduled events'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex rounded-lg border">
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              className={view === 'calendar' ? 'bg-[#235082]' : ''}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              className={view === 'list' ? 'bg-[#235082]' : ''}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
          <Button asChild className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
            <Link href="/booking">
              <Plus className="w-4 h-4 mr-2" />
              Book Event
            </Link>
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              // This would be replaced with actual event dates
              modifiers={{
                booked: SAMPLE_EVENTS.map(event => event.date)
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: '#FF6B6B',
                  color: 'white'
                }
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {SAMPLE_EVENTS.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{event.title}</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    event.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{event.date.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="capitalize">{event.type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Items</p>
                    <p>{event.items.join(", ")}</p>
                  </div>
                  {isAdmin && (
                    <div className="col-span-2 flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">Edit Event</Button>
                      <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                        Cancel Event
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 