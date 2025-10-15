'use client';

import Prism from "@/bits/Prism";
import { useGuild } from "../../context/GuildProvider";

export function PartyPlanner() {
    const { events } = useGuild();
    if (!events) return null;
    return (
        <>
            {/* Fixed Prism Background */}
            <div className="fixed inset-0 -z-10">
                <Prism
                    animationType="rotate"
                    timeScale={0.25}
                    scale={1}
                    height={3}
                    baseWidth={3}
                    noise={0}
                    glow={0.5}
                    hueShift={0.06}
                    colorFrequency={0.25}
                />
            </div>

            {/* Planner Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8 relative z-10">
                <div className="w-full max-w-6xl flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">Party Planner</h1>
                        <p className="text-lg font-light opacity-80">Create & Manage parties for your events.</p>
                    </div>

                    {/* Selection Form */}
                    <form>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Select Event:</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md bg-white/10 text-default">
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.name}</option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}