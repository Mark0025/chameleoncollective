'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ListIcon, Search, Filter } from 'lucide-react'

// Sample events data - this would come from your database
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Wedding Reception",
    date: new Date(2024, 1, 28),
    type: "wedding",
    status: "confirmed",
    customer: "John & Sarah Smith",
    revenue: 1250.00,
    items: ["Tables (10)", "Chairs (100)", "Arch (1)"]
  },
  {
    id: 2,
    title: "Corporate Meeting",
    date: new Date(2024, 2, 5),
    type: "corporate",
    status: "pending",
    customer: "Tech Corp Inc.",
    revenue: 750.00,
    items: ["Projector (1)", "Tables (5)", "Chairs (20)"]
  }
]

export default function AdminEventsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = SAMPLE_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#2C363F]">Event Management</h1>
          <p className="text-[#2C363F]/60">
            Manage and monitor all scheduled events
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
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search by event name or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {filteredEvents.map(event => (
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
                    <p className="text-sm text-gray-500">Customer</p>
                    <p>{event.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="capitalize">{event.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-green-600">${event.revenue.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Items</p>
                    <p>{event.items.join(", ")}</p>
                  </div>
                  <div className="col-span-2 flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Edit Event</Button>
                    <Button variant="outline" className="flex-1">Send Reminder</Button>
                    <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                      Cancel Event
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#235082]">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#FF6B6B]">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">$4,250.00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 