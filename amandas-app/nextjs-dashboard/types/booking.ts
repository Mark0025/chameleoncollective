export interface BookingEvent {
  id: string
  name: string
  price: number
  description: string
  category: string
  type?: 'adult' | 'kids'
}

export interface BookingFormData {
  eventId: string
  date: Date
  name: string
  email: string
  phone: string
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  error?: string
  status?: string
}
