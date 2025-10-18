'use client';
import React, { useState, useRef, useEffect } from 'react';
import Prism from "@/bits/Prism";
import GlassBox from "@/shared/GlassBox";
import { useGuild } from "../../context/GuildProvider";
import { useAuth } from '@/features/auth/context/AuthProvider';
import { createParties } from '../../utils/createParties';
import { guildAPI } from '../../api/api';

interface CustomSelectProps {
    options: Array<{ id: string | number; name: string; }>;
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        options.find(option => option.id === value)
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: typeof options[0]) => {
        setSelectedOption(option);
        onChange(option.id);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Selected Value Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-left flex items-center justify-between hover:bg-black/30 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
                <span className={selectedOption ? "text-white" : "text-white/60"}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full text-left p-3 hover:bg-white/10 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg border-b border-white/10 last:border-b-0 ${selectedOption?.id === option.id ? 'bg-blue-500/20 text-blue-300' : 'text-white'
                                    }`}
                            >
                                {option.name}
                            </button>
                        ))
                    ) : (
                        <div className="p-3 text-white/60 text-center">
                            No options available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export function PartyPlanner() {
    const { fetchEventUserData } = guildAPI;
    const { events, presets } = useGuild();
    const { guild } = useAuth();
    const [parties, setParties] = useState<any[]>([]); // Replace 'any' with a defined party type later REMEMBER
    const [selectedEventId, setSelectedEventId] = useState<string | number>('');
    const [selectedPresetId, setSelectedPresetId] = useState<string | number>('');


    const guildId = guild?.id;
    const hasRequiredData = events && presets && guildId;
    // Debug logs

    console.log('Presets:', presets);
    console.log('Events:', events);

    // Filter to only upcoming events with RSVPs
    const upcomingEvents = hasRequiredData ? events
        .filter(event => new Date(event.event_date) > new Date())
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        : [];

    const selectedEvent = upcomingEvents.find(event => event.id === selectedEventId);
    const matchedPresets = hasRequiredData && selectedEvent 
    ? presets.filter(p => p.game_role_name === selectedEvent?.game_name) 
    : [];
    const selectedPreset = matchedPresets.find(preset => preset.id === selectedPresetId);

    useEffect(() => {
        if (!selectedEvent || !selectedPreset || !guildId) return;
        const fetchData = async () => {
            try {
                const eventUserData = await fetchEventUserData(guildId, selectedEvent.id);
                console.log('Event User Data:', eventUserData);
                // Process eventUserData as needed
            } catch (error) {
                console.error('Error fetching event user data:', error);
            }
        }
        fetchData();
    }, [selectedEventId, selectedPresetId]);

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
                <div className="w-full max-w-4xl flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">🎯 Party Maker</h1>
                        <p className="text-lg font-light opacity-80">Generate parties from event RSVPs using bot presets</p>
                    </div>

                    {/* Event Selection */}
                    <GlassBox className="p-6">
                        <h2 className="text-xl font-semibold mb-4">📅 Select Event</h2>

                        {upcomingEvents.length > 0 ? (
                            <div className="space-y-4">
                                <CustomSelect
                                    options={upcomingEvents.map(event => ({
                                        id: event.id,
                                        name: `${event.name} - ${new Date(event.event_date).toLocaleDateString()}`
                                    }))}
                                    value={selectedEventId}
                                    onChange={setSelectedEventId}
                                    placeholder="Choose an upcoming event..."
                                    className="w-full"
                                />

                                {/* Selected Event Details */}
                                {selectedEvent && (
                                    <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                                        <h3 className="font-semibold mb-2">🎮 {selectedEvent.name}</h3>
                                        <div className="text-sm opacity-70 space-y-1">
                                            <div>📅 {new Date(selectedEvent.event_date).toLocaleString()}</div>
                                            <div>👥 RSVPs: Loading... {/* Add RSVP count from bot data */}</div>
                                            {selectedEvent.description && (
                                                <div>📝 {selectedEvent.description}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 opacity-60">
                                <div className="text-4xl mb-4">📅</div>
                                <p className="text-sm mb-2">No upcoming events available</p>
                                <p className="text-xs opacity-60">Create an event using /create-event in Discord first!</p>
                            </div>
                        )}
                    </GlassBox>

                    {/* Preset Selection - Only show when event is selected */}
                    {selectedEvent && (
                        <GlassBox className="p-6">
                            <h2 className="text-xl font-semibold mb-4">⚙️ Select Party Preset</h2>
                            <div className="text-center py-8 opacity-60">
                                <CustomSelect
                                    options={matchedPresets.map(preset => ({
                                        id: preset.id,
                                        name: preset.preset_name
                                    }))}
                                    value={selectedPresetId}
                                    onChange={setSelectedPresetId}
                                    placeholder="Choose a party preset..."
                                    className="w-full"
                                />
                            </div>
                        </GlassBox>
                    )}

                    {/* Generate Button - Only show when both event and preset selected */}
                    {selectedEvent && (
                        <GlassBox className="p-6 text-center">
                            <button
                                type="button"
                                className="bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 rounded-lg py-3 px-8 font-semibold text-green-300 border border-green-500/30 hover:border-green-500/50 cursor-pointer"
                                disabled={!selectedPresetId}
                                onClick={() => createParties(selectedEvent, selectedPreset)}
                            >
                                🎯 Generate Parties
                            </button>
                            <p className="text-xs opacity-60 mt-2">
                                This will trigger your Discord bot's party maker command
                            </p>
                        </GlassBox>
                    )}
                </div>
            </div>
        </>
    );
}