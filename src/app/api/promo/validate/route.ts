import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    // 1. Get the JSON body from the request
    const body = await request.json();
    const { code } = body;

    // 2. "Impressive" Validation: Check if the code exists
    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 } // 400 = Bad Request
      );
    }

    // 3. "Impressive" Query:
    //    - Make it case-insensitive with .toUpperCase()
    //    - Make sure the code is still active
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code_text', code.toUpperCase()) // Check against 'SAVE10'
      .eq('is_active', true) // Must be active
      .single(); // We only expect one

    // 4. Handle "not found" error
    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json(
        { error: 'Invalid or expired promo code' },
        { status: 404 } // 404 = Not Found
      );
    }

    // 5. Success! Return the valid promo code details
    return NextResponse.json(data);

  } catch (err) {
    // Handle any other server errors
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('API Error:', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}