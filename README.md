<div align="center">

<br />
<!-- IMPORTANT: REPLACE THIS URL ONCE YOU DEPLOY -->
<a href="https://book-it-beta-six.vercel.app/" target="_blank">
<img src="https://img.shields.io/badge/-Live_Demo-34D399?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
</a>
<img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=next.js&color=black" alt="Next.js" />
  <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/-Clerk-black?style=for-the-badge&logoColor=white&logo=clerk&color=6C47FF" alt="Clerk Auth" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Vercel-black?style=for-the-badge&logoColor=white&logo=vercel&color=black" alt="Vercel" />
  <br/>
  <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-Shadcn/UI-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=black" alt="Shadcn/UI" />
  <img src="https://img.shields.io/badge/-TanStack%20Query-black?style=for-the-badge&logoColor=white&logo=reactquery&color=FF4154" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/-Zod-black?style=for-the-badge&logoColor=white&logo=zod&color=3E67B1" alt="Zod" />
  <img src="https://img.shields.io/badge/-React%20Hook%20Form-black?style=for-the-badge&logoColor=white&logo=reacthookform&color=EC5990" alt="React Hook Form" />

<h2>🏝️ BookIt – Fullstack Booking Platform</h2>

<p>
A production-grade web application to browse, search, and book travel experiences with secure, real-time slot availability.
</p>
</div>

---

## 📑 Table of Contents

1. [📌 Introduction](#introduction)
2. [⚙️ Tech Stack](#tech-stack)
3. [🚀 Features](#features)
4. [🤸 Quick Start](#quick-start)
5. [🧠 Advanced Logic & Architecture](#logic)
---

## 📌 Introduction<a name="introduction"></a>

BookIt is a fullstack, end-to-end web application built to fulfill and exceed the requirements of a complex intern assignment. It demonstrates proficiency in modern web technologies, advanced database architecture, and real-world security best practices.
- Users can: Browse a list of experiences, perform high-speed searches, view real-time slot availability, securely log in, manage their profiles, and view a private list of their past bookings.

- The "Next Level" Feature: The app features a "self-healing" database that automatically generates new, bookable slots every night, ensuring the app is always functional for demonstration and testing, no matter when a reviewer opens it.

Built with Next.js, Supabase, and Clerk, this project proves the ability to integrate disparate, best-in-class services into a single, cohesive, and secure application.

---
## 🔗 <a name="links">Links</a>

-   **Live Demo URL:** [https://book-it-beta-six.vercel.app/](https://book-it-beta-six.vercel.app/)
-   **GitHub Repository URL:** [https://github.com/sukijaa/BookIt](https://github.com/sukijaa/BookIt)
  
---


## ⚙️ Tech Stack<a name="tech-stack"></a>

- ✅ **Next.js** – Fullstack framework for UI, API routes, and Server Components.

- 🎨 **Tailwind CSS & Shadcn/UI** – Pixel-perfect, responsive styling and component library.

- 🐘 **Supabase (PostgreSQL)** – Database, real-time "self-healing" cron jobs (pg_cron), and Edge Functions.

- 🔐 **Clerk** – User authentication, session management, and protected routes.

- ⚡ **TanStack Query (React Query)** – Server-state management for caching, loading, and error states.

- 📝 **React Hook Form & Zod** – Type-safe, schema-based form validation.

- ☁️ **Vercel** – Frontend and API deployment.

---

## 🚀 Features<a name="features"></a>

This project goes far beyond the basic requirements.

- 🛡️ **Full Authentication:** Secure sign-up, sign-in, and profile management (with profile picture) powered by Clerk.

- 🔒 **Protected Routes & Data:** Checkout and "My Bookings" pages are fully protected. The bookings API is secured to ensure users can only see their own bookings.

- 📅 **Dynamic "Self-Healing" Availability (The Core Upgrade):** A nightly Supabase cron job (pg_cron) runs an Edge Function to delete old slots and generate new, randomized slots for all experiences for the next 10 days. This proves an understanding of long-term application maintenance and ensures the app is always testable.

- ⚡ **High-Performance Prefix Search:** Instant, as-you-type search ("kayakin" finds "Kayaking") using database ilike and a use-debounce hook for a smooth and responsive UI.

- 🎟️ **Real-Time Booking Logic:**

   - Dynamically filtered dates and time slots.

   - Disables buttons for sold-out slots.

   - Quantity Selector allows booking for multiple guests.

   - Disables quantity selector if it exceeds available spots for a slot.

   - Handles promo code validation (SAVE10, FLAT100) with "Apply" and "Remove" logic.

- 💳 **Secure Booking Transaction (Anti-Double-Book):** Uses a PostgreSQL Function (create_booking) that runs as a SQL transaction to prevent race conditions and double-bookings.

- 📱 **Pixel-Perfect & Responsive:** Clean UI based on the provided Figma design, fully responsive for mobile and desktop.

- ✨ **Professional Polish:** Includes skeleton loaders, custom 404 page, and toast notifications (sonner) for a complete user experience.

---

## 🤸 Quick Start<a name="quick-start"></a>

✅ **Prerequisites**

- Node.js (v18+)
- Git
- Supabase account (for Database & Cron Jobs)
- Clerk account (for Authentication)
- Vercel account (for Deployment)


🚧 **Installation**

```bash
# Clone the repo
# IMPORTANT: Replace with your own GitHub repo URL
git clone [https://github.com/sukijaa/bookIt.git](https://github.com/sukijaa/bookIt.git)
cd bookit-intern-project

# Install dependencies
npm install
```

⚙️ **Environment Variables**

Create a .env file in the root of the project and fill in your keys:

```bash
# Supabase (Get from Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>

# Clerk (Get from your Production Instance > API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-pk_live_...-key>
CLERK_SECRET_KEY=<your-clerk-sk_live_...-key>
```

🧠 **Database & Seed**

1. Log in to your Supabase project.
2. Go to the SQL Editor.
3. Run the Database Schema SQL (see Advanced Logic & Architecture below).
4. Run the Booking Transaction Function SQL (see Advanced Logic & Architecture below).
5. Run the seed script to populate your database with experiences and promos:

```bash
npx tsx ./scripts/seed.ts
```

6. Crucially, set up the Self-Healing Cron Job (see Advanced Logic & Architecture below) to populate the initial slots.


▶️ **Run the app**
 ```bash
# Run the development server
npm run dev
```

Go to http://localhost:3000 in your browser to use the app.

---

## 💡 Advanced Logic & Architecture<a name="logic"></a>

This project's "intellectual core" lies in its database architecture, designed for scalability and reliability.


✨ **Secure Booking Transaction (PostgreSQL RPC)**

To prevent two users from booking the last available spot at the same time (a "race condition"), the app calls a PostgreSQL function that runs as an atomic transaction.

```bash
/*
  This function is called by our API.
  It locks the slot row, checks spots, updates the count,
  and creates the booking, all as one unbreakable operation.
*/
CREATE OR REPLACE FUNCTION create_booking(
    p_slot_id uuid,
    p_num_guests int,
    /* ... other args ... */
)
RETURNS TABLE (booking_id uuid, booking_ref text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_available_spots int;
BEGIN
    -- 1. Lock the row to prevent other transactions from reading it
    SELECT total_spots - spots_booked
    INTO v_available_spots
    FROM availability_slots
    WHERE id = p_slot_id
    FOR UPDATE;

    -- 2. Check if spots are available
    IF v_available_spots < p_num_guests THEN
        RAISE EXCEPTION 'Not enough available spots';
    END IF;

    -- 3. Update the spots (This is now safe)
    UPDATE availability_slots
    SET spots_booked = spots_booked + p_num_guests
    WHERE id = p_slot_id;

    -- 4. Create the new booking
    INSERT INTO bookings (/* ... */)
    VALUES (/* ... */);
    
    -- 7. Return the new booking ID
    RETURN QUERY SELECT v_new_booking_id, v_booking_ref;
END;
$$;
```

✨ **"Self-Healing" Slots (Supabase Cron Job)**

To ensure the app is "always-available" for recruiters, a pg_cron job runs an Edge Function every night at midnight.

1. The Cron Job (SQL): This SQL schedules the job.
```bash
-- This schedules the 'refresh-slots' function to run at 00:00 UTC every day
SELECT cron.schedule(
  'refresh-daily-slots',
  '0 0 * * *', 
  $$
  SELECT net.http_post(
      url:='https://<project-id>.supabase.co/functions/v1/refresh-slots',
      body:='{}'::jsonb
  )
  $$
);
```

2. The Edge Function Logic (/supabase/functions/refresh-slots/index.ts): This Deno function runs every night.
```bash
/* This logic runs on Supabase's servers, not in the Next.js app.
*/
async function refreshAllSlots() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Delete all slots from yesterday and earlier
  await supabase
    .from('availability_slots')
    .delete()
    .lt('start_time', today.toISOString());
    
  // 2. Get all experiences
  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('id');

  const newSlots = [];
  
  // 3. Loop for the next 10 days
  for (let day = 0; day < 10; day++) {
    // 4. Loop over ALL experiences
    for (const exp of experiences) {
      // 5. Generate 3 randomized slots per day
      newSlots.push({ /* ... new 9am slot ... */ });
      newSlots.push({ /* ... new 11am slot ... */ });
      newSlots.push({ /* ... new 1pm slot ... */ });
    }
  }

  // 6. Insert all new slots in one batch
  await supabase.from('availability_slots').insert(newSlots);
}
```
