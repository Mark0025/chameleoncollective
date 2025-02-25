'use server'

import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import type { Event, EventResponse } from '@/app/lib/definitions'

export async function getEvents(): Promise<EventResponse> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { events: [], error: 'Unauthorized' }
    }

    const result = await sql`
      SELECT * FROM events 
      ORDER BY created_at DESC
    `

    const events = result.map(row => ({
      id: row.id as string,
      name: row.name as string,
      price: row.price as number,
      description: row.description as string,
      category: row.category as string,
      date: row.date ? new Date(row.date) : undefined,
      customerName: row.customer_name as string | undefined,
      customerEmail: row.customer_email as string | undefined,
      customerPhone: row.customer_phone as string | undefined,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      status: row.status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | undefined,
      userId: row.user_id as string | undefined
    }))

    return { events, error: null }
  } catch (error) {
    console.error('Database Error:', error)
    return { events: [], error: 'Failed to fetch events.' }
  }
}

export async function updateEventStatus(eventId: string, status: string) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    await sql`
      UPDATE events
      SET status = ${status}
      WHERE id = ${eventId}
    `

    revalidatePath('/admin/events')
    return { success: true, error: null }
  } catch (error) {
    console.error('Database Error:', error)
    return { success: false, error: 'Failed to update event status.' }
  }
}
