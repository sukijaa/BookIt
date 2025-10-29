'use client';

import { Suspense } from 'react'; // Make sure Suspense is imported
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'; // Added Loader2 for fallback

// This component uses useSearchParams()
function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const ref = searchParams.get('ref');

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-4">
          Your booking reference is:
          <span className="font-semibold text-gray-900 ml-1.5">{ref}</span>
        </p>
        <p className="text-gray-500">
          You will receive a confirmation email shortly.
        </p>
        <Button onClick={() => router.push('/')} className="mt-8">
          Back to Home
        </Button>
      </div>
    );
  }

  // Handle failure
  return (
    <div className="flex flex-col items-center text-center">
      <XCircle className="h-20 w-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Booking Failed</h1>
      <p className="text-lg text-gray-600 mb-4">
        Unfortunately, we could not complete your booking.
      </p>
      <p className="text-gray-500">
        Please try again or contact support if the issue persists.
      </p>
      <Button onClick={() => router.push('/')} className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}

// This is the main page component that wraps ResultContent in Suspense
export default function BookingResultPage() {
  return (
    <div className="container mx-auto flex h-[70vh] items-center justify-center px-4">
      {/* --- THIS IS THE FIX --- */}
      <Suspense fallback={<ResultSkeleton />}>
        <ResultContent />
      </Suspense>
      {/* --------------------- */}
    </div>
  );
}

// Simple fallback skeleton
function ResultSkeleton() {
  return (
    <div className="flex flex-col items-center text-center animate-pulse">
      <Loader2 className="h-20 w-20 text-gray-300 mb-6 animate-spin" />
      <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-80 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-72"></div>
      <div className="h-10 bg-gray-200 rounded w-32 mt-8"></div>
    </div>
  );
}
