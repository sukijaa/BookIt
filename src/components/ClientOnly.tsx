'use client';

import { useState, useEffect } from 'react';

// This component prevents hydration mismatches
// by ensuring its children only render on the client.
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // While server-rendering or before client has mounted,
    // return null or a loader.
    return null;
  }

  return <>{children}</>;
}