'use client'; // This file is a client-side component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// This is the component that will wrap our entire application
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We use useState to create the client *once* per user session
  // This prevents it from being recreated on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // "Impressive" feature:
            // Stale-while-revalidate strategy.
            // Data is served from cache (stale) immediately,
            // while a new fetch happens in the background.
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}