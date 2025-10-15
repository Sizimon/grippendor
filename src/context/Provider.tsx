'use client';

import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { NavWrapper } from "@/features/nav/NavWrapper";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NavWrapper />
            {children}
        </AuthProvider>
    );
}