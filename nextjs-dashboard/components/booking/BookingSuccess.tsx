'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

interface BookingSuccessProps {
  bookingId: string
  onClose: () => void
}

export function BookingSuccess({ bookingId, onClose }: BookingSuccessProps) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your booking has been confirmed. Your booking ID is:
        </p>
        <p className="font-mono text-lg bg-gray-100 p-2 rounded">{bookingId}</p>
        <p className="text-gray-600 mt-4">
          We will send you a confirmation email with all the details.
        </p>
        <Button onClick={onClose} className="mt-6">
          Book Another Event
        </Button>
      </div>
    </Card>
  )
}
