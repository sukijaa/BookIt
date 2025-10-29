import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import type { Experience } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    // If no query, return all experiences
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    } catch (err) {
      console.error('API Error (fetching all):', err);
      return NextResponse.json(
        { error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }

  // If there IS a query, perform the search
  try {
    // --- THIS IS THE FINAL, 100% RELIABLE FIX ---
    
    // 1. Sanitize the query and prepare it for ILIKE
    //    We wrap it in %...% to match anywhere
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const searchQuery = `%${sanitizedQuery}%`;

    // 2. Use .or() to search title OR location
    //    ilike is case-insensitive
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .or(
        `title.ilike.${searchQuery}, location.ilike.${searchQuery}, description.ilike.${searchQuery}`
      )
      .order('created_at', { ascending: false });
    // --- END OF FIX ---

    if (error) {
      console.error('Supabase search error:', error);
      throw new Error(error.message);
    }

     if (!data || data.length === 0) {
        console.log(`No results found for ILIKE: "${searchQuery}"`);
        return NextResponse.json([]); // Return empty array
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error('API Search Error:', err);
    return NextResponse.json(
      { error: 'Internal server error during search', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

