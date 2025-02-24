import { sql } from '@/app/lib/db';
import { bookings } from '@/app/lib/placeholder-data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create bookings table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) NOT NULL,
        date TIMESTAMP NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `;

    // Insert seed data
    for (const booking of bookings) {
      await sql`
        INSERT INTO bookings (
          id,
          event_id,
          date,
          customer_name,
          customer_email,
          customer_phone,
          created_at,
          status
        ) VALUES (
          ${booking.id},
          ${booking.event_id},
          ${booking.date.toISOString()},
          ${booking.customer_name},
          ${booking.customer_email},
          ${booking.customer_phone},
          ${booking.created_at.toISOString()},
          ${booking.status}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
