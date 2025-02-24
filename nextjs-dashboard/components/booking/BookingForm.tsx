'use client'

import { useState, useTransition } from 'react'
import { createBooking } from '@/app/lib/actions/bookings'
import { BookingSuccess } from './BookingSuccess'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PartyPopper, Home, Beer, Wine, GlassWater } from 'lucide-react'

interface BookingFormProps {
  events: {
    id: string
    name: string
    price: number
    description: string
  }[]
}

export function BookingForm({ events }: BookingFormProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent || !date) return

    setError(null)
    startTransition(async () => {
      try {
        const result = await createBooking({
          eventId: selectedEvent,
          date: date,
          name,
          email,
          phone
        })

        if (!result.success) {
          setError(result.error || 'Failed to create booking')
          return
        }

        if (result.bookingId) {
          setSuccessBookingId(result.bookingId)
        }
      } catch (err) {
        setError('An unexpected error occurred')
      }
    })
  }

  const selectedEventDetails = events.find(event => event.id === selectedEvent)

  const handleSuccessClose = () => {
    setSuccessBookingId(null)
    // Reset form
    setSelectedEvent(null)
    setDate(new Date())
    setName('')
    setEmail('')
    setPhone('')
  }

  if (successBookingId) {
    return <BookingSuccess bookingId={successBookingId} onClose={handleSuccessClose} />
  }

  const [step, setStep] = useState(1)
  const [isAdult, setIsAdult] = useState(false)
  const [showAgeVerification, setShowAgeVerification] = useState(false)

  const nextStep = () => {
    if (selectedEvent?.startsWith('evt_bar') && !isAdult && step === 1) {
      setShowAgeVerification(true)
      return
    }
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Card className="p-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={`flex items-center ${number < 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= number
                    ? 'bg-[#235082] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {number}
              </div>
              {number < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > number ? 'bg-[#235082]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Age Verification Modal */}
        {showAgeVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Age Verification Required</h3>
              <p className="text-gray-600 mb-6">
                You must be 21 or older to book an adult party package. 
                By proceeding, you confirm that you are of legal drinking age.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAgeVerification(false)
                    setSelectedEvent(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#235082] hover:bg-[#235082]/90"
                  onClick={() => {
                    setIsAdult(true)
                    setShowAgeVerification(false)
                    setStep(2)
                  }}
                >
                  I am 21 or older
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 1: Event Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">Choose Your Event</h3>
            <div className="grid grid-cols-2 gap-6 max-h-[600px] overflow-y-auto p-2">
              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedEvent === 'evt_balloon'
                    ? 'border-pink-500 bg-pink-50'
                    : 'hover:border-pink-300'
                }`}
                onClick={() => setSelectedEvent('evt_balloon')}
              >
                <div className="flex flex-col items-center text-center">
                  <PartyPopper className="w-16 h-16 text-pink-500 mb-4" />
                  <h4 className="text-xl font-semibold text-pink-600">Balloon Party</h4>
                  <p className="text-sm text-gray-600 mt-2">Setting up balloon directions</p>
                  <p className="text-lg font-bold text-pink-600 mt-4">${(150).toLocaleString()}</p>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedEvent === 'evt_tent'
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-blue-300'
                }`}
                onClick={() => setSelectedEvent('evt_tent')}
              >
                <div className="flex flex-col items-center text-center">
                  <Home className="w-16 h-16 text-blue-500 mb-4" />
                  <h4 className="text-xl font-semibold text-blue-600">Kids Tent Party</h4>
                  <p className="text-sm text-gray-600 mt-2">Set up tents for your party</p>
                  <p className="text-lg font-bold text-blue-600 mt-4">${(250).toLocaleString()}</p>
                </div>
              </div>

              {/* Adult Party Options */}
              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedEvent === 'evt_bar_min'
                    ? 'border-purple-500 bg-purple-50'
                    : 'hover:border-purple-300'
                }`}
                onClick={() => setSelectedEvent('evt_bar_min')}
              >
                <div className="flex flex-col items-center text-center">
                  <Wine className="w-16 h-16 text-purple-500 mb-4" />
                  <h4 className="text-xl font-semibold text-purple-600">Adult Party - 2 Drink Minimum</h4>
                  <p className="text-sm text-gray-600 mt-2">Open bar with 2 drink minimum plus tips</p>
                  <p className="text-lg font-bold text-purple-600 mt-4">${(500).toLocaleString()}</p>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedEvent === 'evt_bar_keg'
                    ? 'border-amber-500 bg-amber-50'
                    : 'hover:border-amber-300'
                }`}
                onClick={() => setSelectedEvent('evt_bar_keg')}
              >
                <div className="flex flex-col items-center text-center">
                  <Beer className="w-16 h-16 text-amber-500 mb-4" />
                  <h4 className="text-xl font-semibold text-amber-600">Adult Party - Keg Package</h4>
                  <p className="text-sm text-gray-600 mt-2">Open bar with 1 keg plus paid liquor</p>
                  <p className="text-lg font-bold text-amber-600 mt-4">${(1250).toLocaleString()}</p>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                  selectedEvent === 'evt_beer_barn'
                    ? 'border-green-500 bg-green-50'
                    : 'hover:border-green-300'
                }`}
                onClick={() => setSelectedEvent('evt_beer_barn')}
              >
                <div className="flex flex-col items-center text-center">
                  <GlassWater className="w-16 h-16 text-green-500 mb-4" />
                  <h4 className="text-xl font-semibold text-green-600">Adult Party - Beer Barn</h4>
                  <p className="text-sm text-gray-600 mt-2">Beer barn with open liquor</p>
                  <p className="text-lg font-bold text-green-600 mt-4">${(250).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border mx-auto"
              disabled={(date) => date < new Date()}
            />
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-8">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Summary */}
            {selectedEventDetails && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <p className="text-sm text-gray-600">
                  {selectedEventDetails.name} - ${(selectedEventDetails.price / 100).toLocaleString()}
                </p>
                {date && (
                  <p className="text-sm text-gray-600">
                    Date: {date.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="px-6"
            >
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 1 && !selectedEvent) ||
                (step === 2 && !date)
              }
              className="bg-[#235082] hover:bg-[#235082]/90 px-6 ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!selectedEvent || !date || !name || !email || !phone || isPending}
              className="bg-[#235082] hover:bg-[#235082]/90 px-6 ml-auto"
            >
              {isPending ? 'Booking...' : 'Book Now'}
            </Button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </Card>
    </form>
  )
}
