'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface BookingSuccessProps {
  bookingId: string
  onClose: () => void
}

export function BookingSuccess({ bookingId, onClose }: BookingSuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000) // Auto close after 5 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <Card className="p-6 bg-green-50 border-green-200">
      <div className="flex flex-col items-center text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <div>
          <h3 className="text-xl font-semibold text-green-800">Booking Confirmed!</h3>
          <p className="text-green-600 mt-1">Your booking has been successfully created.</p>
          <p className="text-sm text-green-700 mt-2">Booking ID: {bookingId}</p>
        </div>
        <Button 
          onClick={onClose}
          variant="outline"
          className="mt-4"
        >
          Close
        </Button>
      </div>
    </Card>
  )
}
