import 'dotenv/config'; // Loads .env variables
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Key is missing from .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// -------------------
// --- SAMPLE DATA ---
// -------------------
// Your 8 experiences
const experiences = [
  {
    title: 'Kayaking in the Mangroves',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    price: 999,
    location: 'Udupi, Karnataka',
    image_urls: ['https://images.unsplash.com/photo-1721329816998-9fee1247d095?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740']
  },
  {
    title: 'Forest Trek & Waterfall Visit',
    description: 'Explore the hidden trails of the Western Ghats. A 3-hour guided trek to a pristine waterfall. Packed lunch included.',
    price: 1250,
    location: 'Coorg, Karnataka',
    image_urls: ['https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740']
  },
  {
    title: 'Coastal Surfing Lessons',
    description: 'Learn to ride the waves with our expert instructors. 2-hour beginner lesson with all equipment provided. Suitable for all ages.',
    price: 2500,
    location: 'Kovalam, Kerala',
    image_urls: ['https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1688']
  },
  {
    title: 'Old Goa Heritage Walk',
    description: 'Step back in time and explore the historic churches and cathedrals of Old Goa. A 2-hour guided walk with a local historian.',
    price: 800,
    location: 'Goa, India',
    image_urls: ['https://images.unsplash.com/photo-1667797478659-9a054263c4a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1905']
  },
  {
    title: 'Jaipur Block Printing Workshop',
    description: 'Learn the traditional art of Rajasthani block printing. Create your own scarf or tote bag to take home. All materials provided.',
    price: 1500,
    location: 'Jaipur, Rajasthan',
    image_urls: ['https://images.unsplash.com/photo-1755408007655-9ac329cfa145?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1738']
  },
  {
    title: 'Paragliding in Bir Billing',
    description: 'Experience the thrill of flying over the Himalayas. A 30-minute tandem paragliding flight with a certified pilot. Includes video recording.',
    price: 3500,
    location: 'Bir, Himachal Pradesh',
    image_urls: ['https://images.unsplash.com/photo-1724081549788-740e87e42a38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1744']
  },
  {
    title: 'Scuba Diving (Beginner)',
    description: 'Discover the underwater world of the Andaman Islands. A PADI-certified discover scuba dive with one-on-one instructor guidance. No swimming skills required.',
    price: 4800,
    location: 'Havelock Island, Andans',
    image_urls: ['https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740']
  },
  {
    title: 'Mumbai Street Food Tour',
    description: 'Taste the iconic flavors of Mumbai. A 3-hour guided evening tour sampling 8-10 classic street food dishes. Hygienic and safe.',
    price: 1800,
    location: 'Mumbai, Maharashtra',
    image_urls: ['https://images.unsplash.com/photo-1665206221363-568ea2f7b195?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740']
  },
];

const promoCodes = [
  {
    code_text: 'SAVE10',
    discount_type: 'percentage',
    discount_value: 10, // 10%
  },
  {
    code_text: 'FLAT100',
    discount_type: 'fixed',
    discount_value: 100, // ₹100
  },
];

// -------------------
// --- SEED SCRIPT ---
// -------------------

// Helper function for random numbers
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// THIS IS THE NEW "NEXT-LEVEL" SEEDING FUNCTION
async function main() {
  console.log('Seeding started...');

  // 1. Clear existing data
  await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('availability_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('promo_codes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Seed Experiences
  const { data: expData, error: expError } = await supabase
    .from('experiences')
    .insert(experiences)
    .select();

  if (expError) {
    console.error('Error seeding experiences:', expError);
    return;
  }
  console.log(`Seeded ${expData.length} experiences.`);

  // 3. Seed Promo Codes
  const { error: promoError } = await supabase.from('promo_codes').insert(promoCodes);
  if (promoError) {
    console.error('Error seeding promo codes:', promoError);
    return;
  }
  console.log(`Seeded ${promoCodes.length} promo codes.`);
  
  // 4. "NEXT-LEVEL" FIX: Seed slots for ALL experiences for the next 10 days
  console.log(`Seeding slots for ${expData.length} experiences for 10 days...`);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newSlots = [];

  // Loop over ALL 8 experiences
  for (const exp of expData) {
    // Loop for the next 10 days (0 = today, 1 = tomorrow, etc.)
    for (let day = 0; day < 10; day++) {
      // Create 3 slots per day: 9am, 11am, 1pm
      const dayOffset = day * 24 * 60 * 60 * 1000;
      
      // 9:00 AM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 9 * 60 * 60 * 1000), // 9:00 AM
        end_time: new Date(today.getTime() + dayOffset + 11 * 60 * 60 * 1000), // 11:00 AM
        total_spots: 10,
        spots_booked: getRandomInt(0, 10), // Randomly booked spots
      });

      // 11:00 AM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 11 * 60 * 60 * 1000), // 11:00 AM
        end_time: new Date(today.getTime() + dayOffset + 13 * 60 * 60 * 1000), // 1:00 PM
        total_spots: 10,
        spots_booked: getRandomInt(0, 8), // Make this one less likely to be sold out
      });

      // 1:00 PM Slot
      newSlots.push({
        experience_id: exp.id,
        start_time: new Date(today.getTime() + dayOffset + 13 * 60 * 60 * 1000), // 1:00 PM
        end_time: new Date(today.getTime() + dayOffset + 15 * 60 * 60 * 1000), // 3:00 PM
        total_spots: 10,
        spots_booked: getRandomInt(5, 10), // Make this one more likely to be busy
      });
    }
  }

  const { error: slotError } = await supabase.from('availability_slots').insert(newSlots);
  if (slotError) {
    console.error('Error seeding slots:', slotError);
    return;
  }
  // 8 experiences * 10 days * 3 slots/day = 240 slots
  console.log(`Seeded ${newSlots.length} total slots.`);
  console.log('Seeding complete! 🌱');
}

// Run the script
main();
