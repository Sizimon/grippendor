'use client';
import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { Navigation } from "./components/Navigation";
import { useAuth } from "@/features/auth/context/AuthProvider";

export const NavWrapper = () => {
    const { isAuthenticated } = useAuth();
    const [navOpen, setNavOpen] = useState(false);

    return (
        <>
            {/* Nav Button Goes Here */}
            {isAuthenticated && (
                <button
                className={`${navOpen ? 'hidden' : 'block'} opacity-50 fixed top-4 left-4 z-50 cursor-pointer hover:opacity-100 transition duration-300`}
                aria-label="Open navigation menu"
                title="Open navigation menu"
                onClick={() => setNavOpen(true)}
            >
                <CiMenuBurger className='h-8 w-8 text-text hover:text-cyan-300 transition-color duration-400' />
            </button>
            ) }


            {/* Navigation Menu */}
            <Navigation 
                navOpen={navOpen} 
                setNavOpen={setNavOpen}
            />
        </>
    )
}