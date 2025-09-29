'use client';

import PrivateLayout from '@/layouts/PrivateLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PrivateLayout>{children}</PrivateLayout>;
}