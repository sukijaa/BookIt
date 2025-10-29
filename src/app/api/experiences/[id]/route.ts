import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// We only need the 'request' object.
export async function GET(request: Request) {
  try {
    // 1. Get the URL and extract the ID
    const url = new URL(request.url);
    // url.pathname will be "/api/experiences/9535ae9e-..."
    const id = url.pathname.split('/').pop(); // This gets the last part of the URL

    // 2. Check if the ID was found
    if (!id || id === '[id]') {
      return NextResponse.json({ error: 'Experience ID is required or invalid' }, { status: 400 });
    }

    // 3. The rest of your code is perfect
    const { data, error } = await supabase
      .from('experiences')
      .select('*, availability_slots(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      throw new Error(error.message);
    }
    
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