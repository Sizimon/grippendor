'use client';

import { AuthProvider } from "@/features/auth/context/AuthProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}