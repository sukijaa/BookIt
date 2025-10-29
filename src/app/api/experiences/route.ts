import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Import our new client

export async function GET() {
  try {
    // This is the "professional" query:
    // 1. Select all columns (*)
    // 2. Order by 'created_at' to show newest first
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    // Handle any Supabase error
    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(error.message);
    }

    // Send the data back as JSON
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
