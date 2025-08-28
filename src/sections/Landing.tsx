'use client';
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import Prism from "@/bits/Prism";
import GlassBox from "@/shared/GlassBox";
import gsap from "gsap";

const Landing: React.FC = () => {
    const { isAuthenticated } = useAuth();
    let tl = gsap.timeline();

    useEffect(() => {
        tl.fromTo("#logo", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power1.out" });
        tl.fromTo("#tagline", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power1.out" });
        tl.fromTo("#bannerBtns", { opacity: 0 }, { opacity: 1, duration: 3, ease: "power1.out" }, "-=0.5");
    }, [])

    const scrollToLearnMore = () => {
        document.getElementById('learn-more-section')?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    const scrollToReadySection = () => {
        document.getElementById('ready-to-get-started')?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* Fixed Prism Background */}
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

            {/* Scrollable Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col h-screen bg-transparent text-default w-full justify-center items-center gap-2">
                    <div className="w-4/5 md:w-1/2 flex flex-col justify-center items-center space-y-4">
                        <div className="text-center space-y-4">
                            <h1 id="logo" className="text-4xl font-bold">LOGO</h1>
                            <p id="tagline" className="text-xl font-extralight">Grippendor, <em className="text-cyan-300">the</em> go to discord community management bot.</p>
                        </div>
                        <div id="bannerBtns" className="flex flex-row space-x-8">
                            <button
                                onClick={scrollToReadySection}
                                className="px-2 py-1 rounded-xl bg-black/40 backdrop-blur-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.75)] cursor-pointer transition-all duration-300">
                                Get Started
                            </button>
                            <button
                                onClick={scrollToLearnMore}
                                className="px-2 py-1 rounded-xl bg-black/40 backdrop-blur-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-pointer transition-all duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

                {/* Learn More Section */}
                <section id="learn-more-section" className="min-h-screen bg-black/20 backdrop-blur-sm p-8 font-extralight">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl mb-8 text-center">About Grippendor</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <GlassBox>
                                <h3 className="text-xl text-cyan-200 mb-4">Features</h3>
                                <ul className="space-y-2">
                                    <li>• Event Management & Automated Reminders</li>
                                    <li>• User Roles & Game Roles</li>
                                    <li>• Party Maker</li>
                                    <li>• Dashboard Customisability</li>
                                </ul>
                            </GlassBox>

                            <GlassBox>
                                <h3 className="text-xl text-cyan-200 mb-4">Getting Started</h3>
                                <p>Setting up Grippendor is simple. Follow our step-by-step guide to get your Discord server up and running in minutes.</p>
                            </GlassBox>
                        </div>

                        <div className="mt-8">
                            <GlassBox>
                                <h3 className="text-xl text-cyan-200 mb-4">How It Works</h3>
                                <p className="mb-4">Grippendor integrates seamlessly with your Discord server to provide powerful management tools and gaming community features.</p>
                                <h3 className="text-lg text-cyan-200 mb-2">To Get Started</h3>
                                <ol className="space-y-2 list-decimal list-inside mb-4">
                                    <li>Add the bot to your server</li>
                                    <li>Run the /setup command & fill in the required fields</li>
                                    <li>Ready to use!</li>
                                </ol>
                                <h3 className="text-lg text-cyan-200 mb-2">For Using The Dashboard</h3>
                                <ol className="space-y-2 list-decimal list-inside">
                                    <li>Head to the website & click "Login"</li>
                                    <li>Use your Server ID (<a className="text-cyan-200 hover:underline hover:underline-offset-4" href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID" rel="noopener noreferrer" target="_blank">found here</a>) & your input password from the "/setup" command</li>
                                    <li>Click "Login" and you're in!</li>
                                </ol>

                            </GlassBox>
                        </div>
                    </div>
                </section>

                {/* Add more sections as needed */}
                <section id="ready-to-get-started" className="bg-black/10 backdrop-blur-sm p-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
                        <button className="px-8 py-4 rounded-xl bg-cyan-500/20 backdrop-blur-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.75)] cursor-pointer transition-all duration-300 text-lg">
                            <a href="https://discord.com/oauth2/authorize?client_id=1306969234261147718" rel="noopener noreferrer" target="_blank">Add to Discord</a>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Landing;