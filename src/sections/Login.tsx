'use client';
import React, { useState } from 'react';
import Prism from '@/bits/Prism';
import GlassBox from '@/shared/GlassBox';
import GlassInput from '@/shared/GlassInput';

export default function Login() {
    const [guildId, setGuildId] = useState<string>('')
    const [password, setPassword] = useState<string>('')
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
                    <GlassBox>
                        <form className='p-4 flex flex-col'>
                            <h1 className='text-center mb-4 text-2xl font-extralight'>LOGIN</h1>
                            <div className='flex flex-col space-y-4'>
                                <GlassInput type='text' placeholder='Server ID' value={guildId} onChange={(e) => setGuildId(e.target.value)} />
                                <GlassInput type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </form>
                    </GlassBox>
                </div>
            </div>
        </>
    )
}