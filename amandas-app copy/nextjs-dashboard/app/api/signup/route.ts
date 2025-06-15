import { NextRequest, NextResponse } from 'next/server';
import { createSignup } from '@/app/lib/actions';

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone } = await req.json();
    const result = await createSignup({ email, name, phone });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
} 