'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import Link from 'next/link'
import { CalendarIcon, ListIcon } from 'lucide-react'
import type { UserMetadata } from '@/types/user'

// Sample events data - this would come from your database
const MARK_EVENTS = [
  {
    id: 1,
    title: "Birthday Party",
    date: new Date(2024, 1, 28),
    type: "birthday",
    status: "confirmed",
    items: ["Tables (5)", "Chairs (40)", "Balloon Arch"]
  },
  {
    id: 2,
    title: "Family Reunion",
    date: new Date(2024, 2, 15),
    type: "other",
    status: "pending",
    items: ["Tables (8)", "Chairs (64)", "Tent"]
  }
]

export default function EventsPage() {
  const { user } = useUser()
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would be an API call filtered by user ID
    if (user?.emailAddresses[0]?.emailAddress === 'mark.carpenter@example.com') {
      setEvents(MARK_EVENTS)
    }
  }, [user])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C363F]">My Events</h1>
          <p className="text-[#2C363F]/60">
            View your scheduled events and reservations
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
              Book New Event
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
              modifiers={{
                booked: events.map(event => event.date)
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
          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-gray-600 mb-4">
                  You don't have any events scheduled
                </p>
                <Button asChild className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90">
                  <Link href="/booking">Book Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map(event => (
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
                    <div className="col-span-2 flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">View Details</Button>
                      <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                        Cancel Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
} 