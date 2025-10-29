import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
