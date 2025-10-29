'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Experience, AvailabilitySlot } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  IndianRupee,
  Minus, // <-- ADDED
  Plus, // <-- ADDED
} from 'lucide-react';
import { toast } from 'sonner'; // <-- ADDED

// Function to fetch a single experience by its ID
async function fetchExperienceById(id: string): Promise<Experience> {
  const { data } = await axios.get(`/api/experiences/${id}`);
  return data;
}

export default function ExperienceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Get the ID from the URL

  // State for the calendar and time selection
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | undefined>(
    undefined
  );
  // --- ADDED QUANTITY LOGIC ---
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      
      if (newQuantity < 1) return 1; // Can't go below 1

      // Check against available spots if a slot is selected
      if (selectedSlot) {
        const availableSpots = selectedSlot.total_spots - selectedSlot.spots_booked;
        if (newQuantity > availableSpots) {
          toast.error('Not enough spots', {
            description: `You can only book up to ${availableSpots} spots for this slot.`,
          });
          return availableSpots; // Set to max available
        }
      } else if (newQuantity > 10) { 
        // Default cap if slot not yet selected
        toast.error('Maximum 10 spots', {
          description: `Please select a time slot to book more.`,
        });
        return 10;
      }
      
      return newQuantity;
    });
  };
  // --- END OF QUANTITY LOGIC ---


  // Fetch the data for this specific experience
  const { data, isLoading, isError, error } = useQuery<Experience>({
    queryKey: ['experience', id], // Unique key for this experience
    queryFn: () => fetchExperienceById(id),
    enabled: !!id, // Only run the query if the ID exists
  });

  // --- Helper Functions ---

  // Get a list of unique, available dates from the slots
  const availableDates =
    data?.availability_slots
      ?.map((slot) => new Date(slot.start_time).toDateString()) // Get unique date strings
      .filter((dateStr, index, self) => self.indexOf(dateStr) === index)
      .map((dateStr) => new Date(dateStr)) // Convert back to Date objects
    || [];

  // Filter slots for the currently selected date
  const slotsForSelectedDate = data?.availability_slots?.filter((slot) => {
    const slotDate = new Date(slot.start_time);
    return slotDate.toDateString() === selectedDate?.toDateString();
  });

  // --- Render Logic ---

  if (isLoading) {
    return <DetailsPageSkeleton />; // Show a skeleton loader
  }

  if (isError) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-600">
          {error instanceof Error && error.message.includes('404')
            ? 'Experience not found'
            : 'Failed to load experience'}
        </h2>
      </div>
    );
  }

  if (!data) {
    return null; // Should be covered by error state, but good for safety
  }

  // --- JSX for the Success State ---
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="mb-6 overflow-hidden rounded-xl shadow-lg">
            <img
              src={data.image_urls[0]}
              alt={data.title}
              className="h-auto w-full object-cover lg:h-[450px]"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/1200x800/eee/ccc?text=Image')}
            />
          </div>

          {/* Title & Description */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {data.title}
          </h1>
          <p className="text-gray-700 leading-relaxed">
            {data.description}
          </p>

          {/* About Section (matches Figma) */}
          <div className="mt-8">
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">About</h2>
            <div className="rounded-lg bg-gray-100 p-4 text-sm text-gray-600">
              Scenic routes, trained guides, and safety briefing. Minimum age 10.
            </div>
          </div>
        </div>

        {/* Right Column: Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-md">
            {/* Price */}
            <div className="mb-4 flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                <IndianRupee className="inline h-5 w-5 -mt-1" />
                {data.price}
              </span>
              <span className="ml-1.5 text-sm text-gray-500">per person</span>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose date
              </label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(undefined); // Reset slot when date changes
                  setQuantity(1); // Reset quantity when date changes
                }}
                className="rounded-md border p-0"
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0)) || // Past dates
                  !availableDates.some(
                    (availableDate) =>
                      availableDate.toDateString() === date.toDateString()
                  )
                }
                initialFocus
              />
            </div>

            {/* Time Slot Picker */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {slotsForSelectedDate?.length ? (
                  slotsForSelectedDate.map((slot) => {
                    const availableSpots = slot.total_spots - slot.spots_booked;
                    const isSoldOut = availableSpots <= 0;
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <Button
                        key={slot.id}
                        variant={isSelected ? 'default' : 'outline'}
                        disabled={isSoldOut}
                        onClick={() => {
                          setSelectedSlot(slot);
                          // Reset quantity if new selection is smaller than current
                          if (quantity > availableSpots) {
                            setQuantity(availableSpots);
                          }
                        }}
                        className={`flex h-auto flex-col items-start px-3 py-2 text-left ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                        } ${
                          isSoldOut
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : ''
                        }`}
                      >
                        <span className="font-semibold">
                          {new Date(slot.start_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                        <span className="text-xs">
                          {isSoldOut
                            ? 'Sold out'
                            : `${availableSpots} spots left`}
                        </span>
                      </Button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 col-span-2">
                    Please select an available date.
                  </p>
                )}
              </div>
            </div>

            {/* --- ADDED QUANTITY UI --- */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                How many people?
              </label>
              <div className="flex items-center justify-between rounded-lg border bg-white p-3">
                <span className="text-gray-700">Guests</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      !selectedSlot ||
                      quantity >= (selectedSlot.total_spots - selectedSlot.spots_booked)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* --- END OF QUANTITY UI --- */}


            {/* Confirm Button */}
            <Button
              size="lg"
              className="w-full bg-yellow-400 text-black font-semibold text-base hover:bg-yellow-500"
              disabled={!selectedSlot} // Disabled until a slot is chosen
              onClick={() => {
                // Guard clause
                if (!selectedSlot || !selectedDate || !data) {
                  console.error('Checkout Error: Missing data');
                  toast.error('Error', {
                    description: 'Please select a valid date and time.',
                  });
                  return; 
                }
                
                // Pass all data, including quantity, to checkout
                const params = new URLSearchParams();
                params.set('experienceId', data.id);
                params.set('title', data.title);
                params.set('price', data.price.toString());
                params.set('slotId', selectedSlot.id);
                params.set('startTime', selectedSlot.start_time);
                params.set('date', selectedDate.toDateString());
                params.set('quantity', quantity.toString()); // <-- PASS QUANTITY

                router.push(`/checkout?${params.toString()}`);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// A Skeleton Loader for the Details Page
function DetailsPageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2">
          <Skeleton className="mb-6 h-[450px] w-full rounded-xl" />
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="mt-2 h-6 w-5/6" />
        </div>
        {/* Right Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-md">
            <Skeleton className="mb-4 h-8 w-1/3" />
            <Skeleton className="mb-4 h-64 w-full" />
            <Skeleton className="mb-6 h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}