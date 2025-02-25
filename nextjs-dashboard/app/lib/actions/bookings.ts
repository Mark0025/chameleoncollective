'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'

import { Booking } from '@/app/lib/definitions'

interface BookingData {
  eventId: string
  date: Date
  name: string
  email: string
  phone: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export async function createBooking(data: BookingData) {
  console.log('Creating booking with data:', data)
  try {
    const bookingId = `book_${Date.now()}`
    const user = await currentUser()
    
    // Validate required fields
    if (!data.eventId || !data.date || !data.name || !data.email || !data.phone) {
      console.error('Missing required fields:', { 
        eventId: !!data.eventId,
        date: !!data.date,
        name: !!data.name,
        email: !!data.email,
        phone: !!data.phone
      })
      return { success: false, error: 'Missing required fields' }
    }

    // Verify event exists
    const event = await sql`
      SELECT id, name, price FROM products 
      WHERE id = ${data.eventId} AND category = 'events'
    `
    if (!event.length) {
      console.error('Event not found:', data.eventId)
      return { success: false, error: 'Invalid event selected' }
    }

    // Get user role if authenticated
    let userRole = 'user'
    if (user?.id) {
      const userResult = await sql`
        SELECT role FROM users WHERE clerk_id = ${user.id}
      `
      if (userResult.length > 0) {
        userRole = userResult[0].role
      }
    }

    // Set initial status based on user role
    const status = userRole === 'admin' ? 'confirmed' : 'pending'

    console.log('Creating booking record...')
    const result = await sql`
      INSERT INTO bookings (
        id,
        event_id,
        date,
        customer_name,
        customer_email,
        customer_phone,
        user_id,
        status
      ) VALUES (
        ${bookingId},
        ${data.eventId},
        ${data.date.toISOString()},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${user?.id || null},
        ${status}
      )
    `

    console.log('Booking created successfully:', bookingId)
    revalidatePath('/dashboard/events')
    return { success: true, bookingId }
  } catch (error) {
    console.error('Failed to create booking:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create booking'
    }
  }
}
