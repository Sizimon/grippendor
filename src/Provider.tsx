'use client';

import { AuthProvider } from "@/context/AuthProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}