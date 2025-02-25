'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { Event, EventResponse } from '@/app/lib/definitions'

export async function getEvents(): Promise<EventResponse> {
  try {
    const user = await currentUser()
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get events based on user role
    const events = await sql`
      WITH user_role AS (
        SELECT role FROM users WHERE clerk_id = ${user.id}
      )
      SELECT 
        b.id,
        b.date,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.created_at,
        b.status,
        b.user_id,
        p.name as event_name,
        p.price as event_price,
        p.description as event_description
      FROM bookings b
      JOIN products p ON b.event_id = p.id
      WHERE 
        CASE 
          WHEN (SELECT role FROM user_role) = 'admin' THEN true
          ELSE b.user_id = ${user.id}
        END
      ORDER BY b.date DESC
    `

    const mappedEvents = events.map(event => ({
      id: event.id,
      name: event.event_name,
      price: event.event_price,
      description: event.event_description,
      category: 'events',
      date: new Date(event.date),
      customerName: event.customer_name,
      customerEmail: event.customer_email,
      customerPhone: event.customer_phone,
      createdAt: new Date(event.created_at),
      status: event.status || 'pending',
      userId: event.user_id
    }))

    return { events: mappedEvents, error: null }

  } catch (error) {
    console.error('Failed to fetch events:', error)
    return { events: [], error: 'Failed to fetch events' }
  }
}

export async function updateEventStatus(eventId: string, status: string) {
  try {
    const user = await currentUser()
    
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Check if user is admin or owns the booking
    const result = await sql`
      WITH user_role AS (
        SELECT role FROM users WHERE clerk_id = ${user.id}
      )
      UPDATE bookings 
      SET status = ${status}
      WHERE id = ${eventId}
      AND (
        user_id = ${user.id}
        OR EXISTS (
          SELECT 1 FROM user_role WHERE role = 'admin'
        )
      )
      RETURNING id
    `

    if (result.length === 0) {
      return { success: false, error: 'Not authorized to update this event' }
    }

    revalidatePath('/dashboard/events')
    return { success: true }
  } catch (error) {
    console.error('Failed to update event status:', error)
    return { success: false, error: 'Failed to update event status' }
  }
}
