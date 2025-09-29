'use client';

import { GuildProvider } from '@/features/guild/context/GuildProvider';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuildProvider>
      {children}
    </GuildProvider>
  );
}