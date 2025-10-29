import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get Supabase credentials from the Function's environment
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
// "IMPRESSIVE" FIX: Use the Service Key to bypass RLS for our admin script
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY') ?? '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function for random numbers
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This is our main logic
async function refreshAllSlots() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- 1. Delete all slots from yesterday and earlier ---
  const { error: deleteError } = await supabase
    .from('availability_slots')
    .delete()
    .lt('start_time', today.toISOString()); // 'lt' = less than

  if (deleteError) {
    console.error('Error deleting old slots:', deleteError.message);
    // Don't stop the function; just log the error and continue
  }

  // --- 2. Get all experiences ---
  const { data: experiences, error: expError } = await supabase
    .from('experiences')
    .select('id');

  if (expError) {
    console.error('Error fetching experiences:', expError);
    return { error: 'Could not fetch experiences' };
  }
  
  if (!experiences) {
    console.error('No experiences found');
    return { error: 'No experiences found' };
  }

  // --- 3. Generate all new slots ---
  const newSlots = [];

  // Loop for the next 10 days
  for (let day = 0; day < 10; day++) {
    const dayOffset = day * 24 * 60 * 60 * 1000;

    // Loop over ALL 8 experiences
    for (const exp of experiences) {
      // 9:00 AM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 9 * 60 * 60 * 1000), // 9:00 AM
        end_time: new Date(today.getTime() + dayOffset + 11 * 60 * 60 * 1000), // 11:00 AM
        total_spots: 10,
        spots_booked: getRandomInt(0, 10),
      });

      // 11:00 AM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 11 * 60 * 60 * 1000), // 11:00 AM
        end_time: new Date(today.getTime() + dayOffset + 13 * 60 * 60 * 1000), // 1:00 PM
        total_spots: 10,
        spots_booked: getRandomInt(0, 8),
      });

      // 1:00 PM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 13 * 60 * 60 * 1000), // 1:00 PM
        end_time: new Date(today.getTime() + dayOffset + 15 * 60 * 60 * 1000), // 3:00 PM
        total_spots: 10,
        spots_booked: getRandomInt(5, 10),
      });
    }
  }

  // --- 4. Insert new slots into the database ---
  const { error: slotError } = await supabase.from('availability_slots').insert(newSlots);

  if (slotError) {
    console.error('Error seeding new slots:', slotError);
    return { error: 'Could not insert new slots' };
  }

  return {
    message: `Successfully refreshed ${newSlots.length} slots for ${experiences.length} experiences.`,
  };
}

// This is the "server" part that handles the request
Deno.serve(async (req) => {
  try {
    // This is the function that does all the work
    const result = await refreshAllSlots();
    
    return new Response(JSON.stringify(result), {
      // "IMPRESSIVE" FIX: We don't need CORS for a cron job
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errMessage }), {
      // "IMPRESSIVE" FIX: We don't need CORS for a cron job
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
