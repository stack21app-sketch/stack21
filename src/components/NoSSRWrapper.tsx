'use client';

import { useClientOnly } from '@/hooks/useClientOnly';

interface NoSSRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function NoSSRWrapper({ children, fallback = null }: NoSSRWrapperProps) {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
