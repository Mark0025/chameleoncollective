'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, Users } from 'lucide-react'

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDuration, setSelectedDuration] = useState<string>('')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Event Details */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#2C363F]">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="guests"
                  type="number"
                  placeholder="Enter number of guests"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <div className="border rounded-md p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time" className="pl-10">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger id="duration" className="pl-10">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                      <SelectItem value="6">6 Hours</SelectItem>
                      <SelectItem value="8">8 Hours</SelectItem>
                      <SelectItem value="full">Full Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Requirements</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes for your event..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Selected Items */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#2C363F]">Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500">No items selected yet</p>
              <Button
                className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90"
              >
                Browse Available Items
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#2C363F]">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Rental Items</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Duration Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total</span>
                <span>$0.00</span>
              </div>
              <Button
                className="w-full bg-[#235082] hover:bg-[#235082]/90"
              >
                Proceed to Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 