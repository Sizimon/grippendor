import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '@/features/auth/context/AuthProvider';

import { useRouter } from 'next/navigation';

export function Navigation({
    navOpen,
    setNavOpen, }: {
        navOpen: boolean;
        setNavOpen: (open: boolean) => void;
    }) {
    const router = useRouter();
    const { guild, logout } = useAuth();
    if (!guild) return null;

    // Nav Ref for animation
    const navRef = useRef<HTMLDivElement>(null);

    {/* 🟢 Nav Close Controller 🟢 */}
    useEffect(() => {
        if (!navOpen) return;
        const handleClickOutsideNav = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event?.target as Node)) {
                setNavOpen(false);
            }
        }

        document.addEventListener('click', handleClickOutsideNav);

        return () => {
            document.removeEventListener('click', handleClickOutsideNav);
        }
    }, [navOpen]);
    {/* 🔴 Nav Close Controller 🔴 */}

    {/* 🟢 GSAP Nav Controls 🟢 */}
    useEffect(() => {
        if (navRef.current) {
            gsap.set(navRef.current, {
                x: '-100%',
                opacity: 0
            });
        }
    }, [navRef]);

    useEffect(() => {
        if (!navRef.current) return;
        gsap.to(navRef.current, {
            x: navOpen ? 0 : '-100%',
            opacity: navOpen ? 1 : 0,
            duration: 0.4,
            ease: navOpen ? 'power2.out' : 'power2.in'
        });
    }, [navOpen, navRef]);
    {/* 🔴 GSAP Nav Controls 🔴 */}

    return (
        <div>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 z-50 w-8/12 lg:w-4/12 xl:w-3/12 h-screen bg-foreground/20 backdrop-blur-md flex flex-row p-4 ${navOpen ? 'pointer-events-auto' : 'pointer-events-none'} flex justify-center`}
            >
                <div className='flex flex-col text-2xl justify-evenly h-full'>
                    <button 
                    className='uppercase hover:text-cyan-300 transition-color duration-400 cursor-pointer' 
                    onClick={() => router.push(`/${guild.id}`)}
                >
                        Dashboard
                    </button>
                    <button 
                        className='uppercase hover:text-cyan-300 transition-color duration-400 cursor-pointer'
                        onClick={() => router.push(`/${guild.id}/events`)}
                    >
                        Events
                    </button>
                    <button 
                        className='uppercase hover:text-cyan-300 transition-color duration-400 cursor-pointer'
                        onClick={() => router.push(`/${guild.id}/party-planner`)}
                    >
                        Party Planner
                    </button>
                    <button 
                        className='uppercase hover:text-cyan-300 transition-color duration-400 cursor-pointer'
                        onClick={() => {
                            logout();
                            router.push('/landing');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
}