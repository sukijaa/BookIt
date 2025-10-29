'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Calendar,
  Ticket,
  Clock,
  Users,
  IndianRupee,
} from 'lucide-react';
import { ClientOnly } from '@/components/ClientOnly';

// Define the shape of our joined data
// (This is a bit complex, but it's what makes the page work)
type Experience = {
  id: string;
  title: string;
  image_urls: string[];
};

type AvailabilitySlot = {
  id: string;
  start_time: string;
  end_time: string;
  experiences: Experience; // Nested experience
};

type Booking = {
  id: string;
  created_at: string;
  num_guests: number;
  total_price: number;
  status: string;
  booking_ref: string;
  availability_slots: AvailabilitySlot; // Nested slot
};

// This function fetches the data from our new API
async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await axios.get('/api/my-bookings');
  return data;
}

// Main Page Component
export default function MyBookingsPage() {
  // Use useQuery to fetch the user's bookings
  const { data, isLoading, isError, error } = useQuery<Booking[]>({
    queryKey: ['my-bookings'], // Unique key for this query
    queryFn: fetchMyBookings,
  });

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="space-y-6">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-600">
          Failed to load bookings
        </h2>
        <p className="mt-2 text-gray-500">
          {error instanceof Error ? error.message : 'An unknown error occurred.'}
        </p>
      </div>
    );
  }

  // 3. Success State (with no bookings)
  if (data && data.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Ticket className="h-16 w-16 text-gray-400 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No bookings yet
        </h2>
        <p className="text-gray-500 mb-6">
          You haven't booked any experiences. Let's change that!
        </p>
        <Button asChild>
          <Link href="/">Explore Experiences</Link>
        </Button>
      </div>
    );
  }

  // 4. Success State (with bookings)
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-6">
        {data?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

// --- Reusable Booking Card Component ---

function BookingCard({ booking }: { booking: Booking }) {
  // This is a "safe" way to get nested data
  const experience = booking.availability_slots?.experiences;
  const slot = booking.availability_slots;

  if (!experience || !slot) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">
          This booking contains corrupted data and cannot be displayed. Ref:
          {booking.booking_ref}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Image */}
        <div className="md:col-span-1">
          <img
            src={experience.image_urls[0]}
            alt={experience.title}
            className="h-48 w-full object-cover md:h-full"
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x600/eee/ccc?text=Image')}
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase text-green-800">
                {booking.status}
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {experience.title}
              </h2>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-xs text-gray-500">Booking Ref</div>
              <div className="font-mono font-medium text-gray-900">
                {booking.booking_ref}
              </div>
            </div>
          </div>
          
          <div className="border-t my-4"></div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              <ClientOnly>
                {new Date(slot.start_time).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </ClientOnly>
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="h-4 w-4 mr-2" />
              <ClientOnly>
                {new Date(slot.start_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </ClientOnly>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-4 w-4 mr-2" />
              {booking.num_guests} Guest{booking.num_guests > 1 ? 's' : ''}
            </div>
            <div className="flex items-center font-semibold text-gray-900">
              <IndianRupee className="h-4 w-4 mr-1" />
              {booking.total_price.toFixed(2)} Total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton for the Booking Card ---

function BookingCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <Skeleton className="h-48 w-full md:h-full" />
        <div className="md:col-span-2 p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-8 w-48 mt-2" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 mt-1" />
            </div>
          </div>
          <div className="border-t my-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
