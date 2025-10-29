import { Suspense } from 'react'; // <-- 1. Import Suspense
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton'; // <-- 2. Import Skeleton

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookIt - Travel Experiences',
  description: 'Book your next adventure with BookIt.',
};

// Simple Header Skeleton for Suspense Fallback
function HeaderSkeleton() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-64 hidden sm:block" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </header>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>
          <QueryProvider>
            {/* --- THIS IS THE FIX --- */}
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>
            {/* --------------------- */}
            <main>{children}</main>
            <Toaster richColors />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}