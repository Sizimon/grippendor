'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

import Prism from '@/bits/Prism';
import GlassBox from '@/shared/GlassBox';
import GlassInput from '@/shared/GlassInput';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();


    const [guildId, setGuildId] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        if (!guildId || !password) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }
        const result = await login(guildId, password);
        if (result.success) {
            setSuccess('Login successful! Redirecting...');
            router.push('/dashboard');
        } else {
            setError(result.error || 'Login failed.');
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-0">
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    scale={1}
                    height={3}
                    baseWidth={3}
                    noise={0}
                    glow={1}
                    hueShift={0.06}
                    colorFrequency={0.25}
                />
            </div>

            <div className='relative z-10'>
                <div className='flex flex-col h-lvh justify-center items-center'>
                    <div className='w-3/4 md:w-1/4'>
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