BookIt: Experiences & Slots

BookIt is a fullstack, production-grade web application for booking travel experiences. Users can browse, search, and book available slots, with secure authentication and a "life-long" self-healing slot system that ensures the app is always functional.

This project was built to demonstrate proficiency in modern, fullstack web development, including advanced database concepts, real-world security, and a pixel-perfect UI.

 ➡️ View the Live Demo ⬅️  (You will add this link in the final step!)

🚀 Tech Stack

This project was built with a modern, "next-level" stack, emphasizing performance, security, and developer experience.

Category

Technology

Purpose

Framework

Next.js 14 (App Router)

Fullstack (Frontend + Backend API Routes)

Database

Supabase

PostgreSQL database, "self-healing" cron jobs

Authentication

Clerk

User accounts, session management, protected routes

UI

React & TypeScript

Core frontend logic and type-safety

Styling

TailwindCSS & Shadcn/UI

Pixel-perfect, responsive design & components

Data Fetching

TanStack Query (React Query)

Server-state management, caching, loading states

Form Handling

React Hook Form & Zod

Type-safe, schema-based form validation

Deployment

Vercel

Frontend & API hosting

Cron Jobs

Supabase pg_cron

Nightly job to refresh booking slots

✨ Core Features

🛡️ Full Authentication: Secure sign-up, sign-in, and profile management (with profile picture) powered by Clerk.

🔒 Protected Routes: Checkout and "My Bookings" pages are fully protected and require a user to be logged in.

⚡ High-Performance Search: Instant, full-text (prefix) search across all experiences using ilike and use-debounce for a smooth UI.

📅 Dynamic "Self-Healing" Availability: A nightly Supabase cron job (Edge Function) automatically deletes old slots and generates new ones for the next 10 days. This ensures the app is always functional for any visitor, any time.

🎟️ Real-Time Booking Logic:

Dynamically filtered dates and time slots.

Disables buttons for sold-out slots or if quantity exceeds available spots.

Handles promo code validation (SAVE10, FLAT100) and applies discounts to the final total.

💳 Secure Booking Transaction: Uses a Supabase RPC (create_booking) function that runs a SQL transaction to prevent double-bookings, ensuring data integrity.

🔐 User-Specific Data: The "My Bookings" page is powered by a secure API that only fetches data belonging to the logged-in user.

📱 Pixel-Perfect & Responsive: Clean UI based on the provided Figma design, fully responsive for mobile and desktop.

Professional Polish: Includes skeleton loaders, error handling, and toast notifications (sonner) for a complete user experience.

🛠️ How to Run Locally

Follow these steps to get the project running on your local machine.

1. Clone the Repository

git clone [https://github.com/your-username/bookit-intern-project.git](https://github.com/your-username/bookit-intern-project.git)
cd bookit-intern-project


2. Install Dependencies

npm install


3. Set Up Environment Variables

Create a file named .env in the root of the project and add the following keys. You can get these from your Supabase and Clerk dashboards.

# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY

# Resend (if email step was included)
# RESEND_API_KEY=YOUR_RESEND_API_KEY


4. Set Up Supabase Database

Log in to Supabase and create a new project.

Go to the SQL Editor and run the schema queries found in:

SQL/Part_1_Schema.sql (You would create this file to be professional)

SQL/Part_4_Booking_Function.sql (You would create this file)

SQL/Part_6_Search.sql (You would create this file)

Run the seed script to populate your database with data:

npx tsx ./scripts/seed.ts


(Optional) To enable the "self-healing" cron job, follow the Supabase Edge Function and pg_cron setup steps.

5. Run the Development Server

npm run dev


Open http://localhost:3000 in your browser to see the application.