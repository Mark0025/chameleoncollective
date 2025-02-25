import { sql } from '@/app/lib/db'
import { BookingForm } from '@/components/booking/BookingForm'

export default async function BookingPage() {
  // Fetch events from the database
  const result = await sql`
    SELECT id, name, price, description 
    FROM products 
    WHERE category = 'events'
  `

  // Map SQL result to expected event type
  const events = result.map(event => ({
    id: event.id,
    name: event.name,
    price: event.price,
    description: event.description
  }))

  return (
    <div className="container mx-auto py-8">
      <BookingForm events={events} />
    </div>
  )
}
