'use client'; // This component uses client-side hooks

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Search, User, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

export function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current page path
  const searchParams = useSearchParams(); // Get current URL params
  const currentQuery = searchParams.get('q') ?? ''; // Get the query from URL

  // Local state for the input field ONLY
  const [inputValue, setInputValue] = useState(currentQuery);

  // Debounce the router push function
  const debouncedUpdateQuery = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    // Only push if the new query is different from the current URL query
    // and we are actually on the home page (where search applies)
    if (pathname === '/' && query !== currentQuery) {
      router.push(`/?${params.toString()}`, { scroll: false }); // scroll: false prevents jumping to top
    }
    // If we are NOT on the home page, clear the input but redirect home
    else if (pathname !== '/' && query) {
         router.push(`/?${params.toString()}`, { scroll: false });
    }

  }, 300); // 300ms debounce

  // Effect to update input value if URL changes (e.g., browser back button)
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedUpdateQuery(newValue);
  };

  const clearSearch = () => {
    setInputValue('');
     // Immediately clear the URL param and navigate
     const params = new URLSearchParams(searchParams.toString());
     params.delete('q');
     router.push(`/?${params.toString()}`, { scroll: false });
  };


  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {/* Using a simple logo SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-black"
          >
            <path d="M15 9l-2.5 2.5a1.5 1.5 0 0 1-2.12 0L8 9" />
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="font-bold text-xl hidden sm:inline">BookIt</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-xl mx-auto">
           {/* Only show search bar on the home page */}
           {pathname === '/' && (
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search experiences (e.g., Kayak, Goa, Trek)"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-16 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black
                [&::-webkit-search-cancel-button]:hidden 
                "
                value={inputValue}
                onChange={handleInputChange}
              />
               {/* Search Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              {/* Clear Button */}
               {inputValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-10 flex items-center justify-center px-2 text-gray-500 hover:text-black"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
              )}
            </div>
           )}
        </div>


        {/* Auth Controls */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <SignedIn>
            <Button variant="outline" size="sm" asChild>
              <Link href="/my-bookings">My Bookings</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </SignInButton>
            <Button size="sm" asChild className="bg-black text-white hover:bg-gray-800 hidden sm:inline-flex">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}