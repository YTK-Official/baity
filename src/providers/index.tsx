'use client';

import { HeroUIProvider, ToastProvider } from '@/components/heroui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
