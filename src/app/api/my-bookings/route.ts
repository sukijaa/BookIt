import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// "IMPRESSIVE" FIX:
// We are creating an ADMIN client here. This client can
// bypass all Row Level Security.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function GET() {
  try {
    // 1. Get the logged-in user's ID (we fixed this with 'await')
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. THIS IS THE NEW, 100% RELIABLE QUERY:
    // We use the 'supabaseAdmin' client to bypass RLS,
    // and then *explicitly* filter for the user's ID.
    // This is secure because our API is protected by auth().
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*, availability_slots(*, experiences(*))')
      .eq('user_id', userId) // <-- The explicit check!
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching bookings:', error);
      throw new Error(error.message);
    }

    // 3. Return the user-specific data
    return NextResponse.json(data);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('API Error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
