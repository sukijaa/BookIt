import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

// Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function POST(request: Request) {
  try {
    // 2. Get the logged-in user's session
    // We must 'await' the auth() call to fix the TypeScript error.
    const { userId } = await auth(); 
    const user = await currentUser();

    // 3. "IMPRESSIVE" SECURITY: Block if not logged in
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to make a booking.' },
        { status: 401 } // 401 = Unauthorized
      );
    }

    const body = await request.json();
    const { slotId, quantity, price } = body;

    // 4. Get user details from the session, NOT the form
    const userEmail = user.emailAddresses[0]?.emailAddress || '';
    const userName = user.fullName || 'BookIt User';

    if (!slotId || !quantity || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 5. Call our RPC function with the SECURE user details
    const { data, error } = await supabaseAdmin.rpc('create_booking', {
      p_slot_id: slotId,
      p_num_guests: quantity,
      p_total_price: price,
      p_user_id: userId, // <-- PASS THE REAL USER ID
      p_user_email: userEmail, // <-- PASS THE SECURE EMAIL
      p_user_name: userName, // <-- PASS THE SECURE NAME
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data[0]);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('API Error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
