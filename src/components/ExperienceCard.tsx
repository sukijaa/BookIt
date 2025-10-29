import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Experience } from '@/types'; // Import our new type
import { MapPin, IndianRupee } from 'lucide-react';

// This is the real card component
export function ExperienceCard({ experience }: { experience: Experience }) {
  // Get the first image as the thumbnail
  const thumbnailUrl = experience.image_urls?.[0] || 'https://placehold.co/600x400/eee/ccc?text=Image';

  return (
    <Link
      href={`/experience/${experience.id}`}
      className="group block rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={thumbnailUrl}
          alt={experience.title}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          // Add a fallback for broken images
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/eee/ccc?text=Image')}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location Tag */}
        <div className="mb-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {experience.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {experience.title}
        </h3>
        
        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {experience.description}
        </p>

        {/* Price & Details Button */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            <span className="text-sm font-normal text-gray-500">From </span>
            <IndianRupee className="inline h-4 w-4 -mt-1" />
            {experience.price}
          </div>
          {/* This matches the yellow button from Figma */}
          <div className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-yellow-500">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}

// This is the skeleton loader component
export function ExperienceCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Skeleton className="h-56 w-full rounded-t-xl rounded-b-none" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-4 h-8 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    </div>
  );
}