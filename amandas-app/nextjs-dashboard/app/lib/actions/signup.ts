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

    // Check if signup already exists
    const existingSignup = await sql`
      SELECT id FROM signups WHERE email = ${validatedData.email}
    `;

    if (existingSignup.length > 0) {
      return { 
        success: false, 
        error: 'Email already registered' 
      };
    }

    // Insert new signup
    await sql`
      INSERT INTO signups (
        email,
        name,
        phone,
        tag
      ) VALUES (
        ${validatedData.email},
        ${validatedData.name || null},
        ${validatedData.phone || null},
        'comingSoon'
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