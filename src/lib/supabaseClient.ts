import { createClient } from '@supabase/supabase-js';

// Get the variables from our .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from .env');
}

// Create and export the Supabase client
// We use the 'anon' key here, which is safe for the public.
// Our RLS policies will handle the security.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
