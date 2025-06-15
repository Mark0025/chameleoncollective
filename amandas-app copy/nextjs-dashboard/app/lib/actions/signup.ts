'use server';

import { sql } from '@/app/lib/db';
import { z } from 'zod';

// Validation schema
const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  phone: z.string().optional(),
});

// Signup function
export async function createSignup(data: { 
  email: string, 
  name?: string, 
  phone?: string 
}) {
  try {
    // Validate input
    const validatedData = SignupSchema.parse(data);

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${validatedData.email}
    `;

    if (existingUser.length > 0) {
      return { 
        success: false, 
        error: 'Email already registered' 
      };
    }

    // Split name into first and last name
    const nameParts = validatedData.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Insert new user
    await sql`
      INSERT INTO users (
        email, 
        first_name, 
        last_name, 
        phone,
        role
      ) VALUES (
        ${validatedData.email},
        ${firstName},
        ${lastName},
        ${validatedData.phone || null},
        'user'
      )
    `;

    return { 
      success: true 
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Signup failed' 
    };
  }
} 