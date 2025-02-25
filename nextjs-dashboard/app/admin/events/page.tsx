'use client'

import { useState, useEffect } from 'react'
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
import { CalendarIcon, ListIcon, Search } from 'lucide-react'
import { getEvents, updateEventStatus } from './actions'
import { useToast } from "@/components/ui/use-toast"
import type { Event } from '@/app/lib/definitions'

export default function AdminEventsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [date, setDate] = useState<Date>(new Date())
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setIsLoading(true)
    const { events, error } = await getEvents()
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
    } else {
      setEvents(events)
    }
    setIsLoading(false)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (event.customerName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (eventId: string, newStatus: string) => {
    const { success, error } = await updateEventStatus(eventId, newStatus)
    if (success) {
      toast({
        title: "Success",
        description: "Event status updated successfully"
      })
      loadEvents() // Reload events to get latest data
    } else {
      toast({
        title: "Error",
        description: error || "Failed to update event status",
        variant: "destructive"
      })
    }
  }

  // Calculate summary statistics
  const todayEvents = events.filter(event => {
    if (!event.date) return false
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  const pendingEvents = events.filter(event => event.status === 'pending')
  const monthlyRevenue = events
    .filter(event => event.status === 'confirmed')
    .reduce((total, event) => total + (event.price || 0), 0)

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Loading events...</div>
      </div>
    )
  }

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
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              modifiers={{
                booked: events
                  .filter(event => event.date)
                  .map(event => new Date(event.date as Date))
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
                  <span>{event.name}</span>
                  <Select
                    value={event.status}
                    onValueChange={(newStatus) => handleStatusUpdate(event.id, newStatus)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{event.date ? new Date(event.date).toLocaleDateString() : 'Not scheduled'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p>{event.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="capitalize">{event.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-green-600">${(event.price / 100).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Items</p>
                    <p>{event.description}</p>
                  </div>
                  <div className="col-span-2 flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">Edit Event</Button>
                    <Button variant="outline" className="flex-1">Send Reminder</Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleStatusUpdate(event.id, 'cancelled')}
                    >
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
            <p className="text-3xl font-bold text-[#235082]">{todayEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Confirmations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#FF6B6B]">{pendingEvents.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${monthlyRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
