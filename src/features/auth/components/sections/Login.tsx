'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Toast from '@/shared/Toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthProvider';

import GlassBox from '@/shared/GlassBox';
import GlassInput from '@/shared/GlassInput';
import { BackgroundVideo } from '@/features/guild/components/ui/BackgroundVideo';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();


    const [guildId, setGuildId] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!guildId || !password) {
            toast.error('Please fill in all fields.');
            setIsLoading(false);
            return;
        }
        const result = await login(guildId, password);
        if (result.success) {
            toast.success('Login successful! Redirecting...');
            router.push(`/${guildId}`);
        } else {
            toast.error(result.error || 'Login failed.');
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-0">
                <BackgroundVideo />
            </div>

            <Toast />

            <div className='relative z-10'>
                <div className='flex flex-col h-lvh justify-center items-center'>
                    <div className='w-11/12 lg:w-2/12'>
                        <GlassBox>
                            <form onSubmit={handleLogin} className='p-4 flex flex-col'>
                                <h1 className='text-center mb-4 text-2xl font-extralight uppercase'>Dashboard Access</h1>
                                <div className='flex flex-col space-y-4 mb-8'>
                                    <GlassInput type='text' placeholder='Server ID' value={guildId} onChange={(e) => setGuildId(e.target.value)} />
                                    <GlassInput type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <button type='submit' className="self-center w-1/2 cursor-pointer uppercase font-extralight px-4 py-2 rounded-xl bg-black/10 backdrop-blur-lg shadow-[0_0_10px_rgba(6,182,212,0.75)] hover:inset-shadow-[0_0_20px_rgba(6,182,212,0.75)]">Login</button>
                            </form>
                        </GlassBox>
                    </div>
                </div>
            </div>
        </>
    )
}