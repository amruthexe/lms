'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';

export function ClientToastWrapper() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error === 'unauthorized') {
      toast.warning(' Please sign in to access this My Course Page .');
    }
  }, [error]);

  return <Toaster position="bottom-center" richColors />;
}
