'use client';

import { GuildProvider } from '@/context/GuildProvider';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuildProvider>
      {children}
    </GuildProvider>
  );
}