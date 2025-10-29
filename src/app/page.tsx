'use client'; // This page uses client-side hooks (useQuery, useSearchParams)

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ExperienceCard, ExperienceCardSkeleton } from '@/components/ExperienceCard';
import type { Experience } from '@/types';
import { AlertCircle, Search } from 'lucide-react';

// --- THIS IS THE FIX ---
// Moved the constant outside the component and added 'export'
export const EXPERIENCES_QUERY_KEY = 'experiences';
// --------------------

// --- Updated Fetch Function ---
async function fetchExperiences(query: string | null): Promise<Experience[]> {
  const endpoint = query ? `/api/search?q=${query}` : '/api/experiences';
  const { data } = await axios.get(endpoint);
  return data;
}

// --- Main Page Content (Needs access to Suspense boundary) ---
function HomePageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  // Use the exported constant for the base query key
  const queryKey = query ? [EXPERIENCES_QUERY_KEY, query] : [EXPERIENCES_QUERY_KEY];

  const { data, isLoading, isError, error } = useQuery<Experience[]>({
    queryKey: queryKey,
    queryFn: () => fetchExperiences(query),
    staleTime: 5 * 60 * 1000,
  });

  // 1. Loading State (Unchanged)
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {query && <h2 className="text-2xl font-semibold mb-6">Searching for "{query}"...</h2>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ExperienceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State (Unchanged)
  if (isError) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-600">
          Failed to load experiences
        </h2>
        <p className="mt-2 text-gray-500">
          {error instanceof Error ? error.message : 'An unknown error occurred.'}
        </p>
      </div>
    );
  }

  // 3. Success State - Handle "No Results" (Unchanged)
  if (!data || data.length === 0) {
    if (query) {
      return (
        <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
          <Search className="h-16 w-16 text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No results found for "{query}"
          </h2>
          <p className="text-gray-500">
            Try searching for a different keyword or location.
          </p>
        </div>
      );
    } else {
       return (
         <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
           <AlertCircle className="h-16 w-16 text-gray-400 mb-6" />
           <h2 className="text-2xl font-semibold text-gray-900 mb-2">
             No experiences available
           </h2>
           <p className="text-gray-500">
             Please check back later.
           </p>
         </div>
       );
    }
  }

  // 4. Success State - Display experiences (Unchanged)
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {query && <h2 className="text-2xl font-semibold mb-6">Showing results for "{query}"</h2>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  );
}


// --- Main Export (Wraps content in Suspense) (Unchanged) ---
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}

// Simple fallback shown while the page initially loads search params (Unchanged)
function HomePageLoadingFallback() {
   return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ExperienceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
}