// This matches the 'availability_slots' table
export type AvailabilitySlot = {
  id: string;
  created_at: string;
  experience_id: string;
  start_time: string; // We'll get this as an ISO 8601 string
  end_time: string;
  total_spots: number;
  spots_booked: number;
};

// This matches the 'experiences' table
export type Experience = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_urls: string[]; // This is our 'jsonb' column
  
  // This is not in the database, but our API joins it for us
  // on the details page. '?' means it's optional.
  availability_slots?: AvailabilitySlot[]; 
};