'use client';
import React, { useState, useRef, useEffect } from 'react';
import Prism from "@/bits/Prism";
import GlassBox from "@/shared/GlassBox";
import { useGuild } from "../../context/GuildProvider";
import { useAuth } from '@/features/auth/context/AuthProvider';
import { createParties } from '../../utils/createParties';
import { guildAPI } from '../../api/api';

import { PartyMember } from '../../types';
import { PartyContainer } from '../ui/PartyContainer';
import { BackgroundVideo } from '../ui/BackgroundVideo';

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
    const [unusedMembers, setUnusedMembers] = useState<any[]>([]); // Replace 'any' with a defined user type later REMEMBER
    const [showResults, setShowResults] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | number>('');
    const [selectedPresetId, setSelectedPresetId] = useState<string | number>('');
    const [eventParticipants, setEventParticipants] = useState<any[]>([]); // Replace 'any' with a defined user type later REMEMBER
    const [draggedMember, setDraggedMember] = useState<{
        member: PartyMember;
        sourcePartyId: number;
        memberIndex: number;
    } | null>(null);


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

    console.log('Selected presets', selectedPreset);

    useEffect(() => {
        if (!selectedEvent || !selectedPreset || !guildId) return;
        const fetchData = async () => {
            try {
                const eventUserData = await fetchEventUserData(guildId, selectedEvent.id);
                setEventParticipants(eventUserData.data);
            } catch (error) {
                console.error('Error fetching event user data:', error);
            }
        }
        fetchData();
    }, [selectedEventId, selectedPresetId]);

    // Handlers for Parties

    const handleGenerateParties = () => {
        if (!selectedEvent || !selectedPreset || !eventParticipants.length) return;

        const result = createParties(selectedEvent, selectedPreset, eventParticipants);
        setParties(result.parties);
        setUnusedMembers(result.unusedMembers);
        setShowResults(true);
    };

    // Role change handler
    const handleRoleChange = (partyId: number, memberIndex: number, newRole: string) => {
        setParties(prevParties =>
            prevParties.map(party =>
                party.id === partyId
                    ? {
                        ...party,
                        members: party.members.map((member: PartyMember, index: number) =>
                            index === memberIndex
                                ? { ...member, role: newRole }
                                : member
                        )
                    }
                    : party
            )
        );
    };

    // Drag and Drop Handlers
    const handleDragStart = (member: PartyMember, partyId: number, memberIndex: number) => {
        setDraggedMember({ member, sourcePartyId: partyId, memberIndex });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetPartyId: number) => {
        if (!draggedMember) return;

        const { sourcePartyId, memberIndex, member } = draggedMember;

        if (sourcePartyId === targetPartyId) {
            setDraggedMember(null);
            return;
        }

        setParties(prevParties => {
            const newParties = prevParties.map(party => ({ ...party, members: [...party.members] }));

            // Remove from source party (handle unused members case)
            if (sourcePartyId !== -1) {
                const sourceParty = newParties.find(p => p.id === sourcePartyId);
                if (sourceParty) {
                    sourceParty.members.splice(memberIndex, 1);
                }
            }

            // Add to target party
            const targetParty = newParties.find(p => p.id === targetPartyId);
            if (targetParty) {
                targetParty.members.push(member);
            }

            return newParties;
        });

        // If dragged from unused members, remove from unused list
        if (sourcePartyId === -1) {
            setUnusedMembers(prev => prev.filter((_, index) => index !== memberIndex));
        }

        setDraggedMember(null);
    };

    // Add empty party function
    const addEmptyParty = () => {
        const newPartyId = parties.length > 0 ? Math.max(...parties.map(p => p.id)) + 1 : 1;
        setParties(prev => [...prev, { id: newPartyId, members: [] }]);
    };

    return (
        <>
            {/* Fixed Prism Background */}
            <div className="fixed inset-0 -z-10">
                <BackgroundVideo />
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
                            <div className="text-center">
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

                                {/* Selected Event Details */}
                                {selectedPreset && (
                                    <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                                        <h3 className="font-semibold mb-2">🎮 {selectedPreset.preset_name}</h3>
                                        <div className="text-sm space-y-3">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <span>🛠️</span>
                                                <span>Roles Configuration</span>
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {selectedPreset.data.roles.map((role: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                            <span className="font-medium text-white">{role.roleName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-white/60">×</span>
                                                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                                                                {role.count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Total party size indicator */}
                                            <div className="pt-2 border-t border-white/10">
                                                <div className="text-xs text-white/60 text-center">
                                                    Total Party Size: <span className="font-semibold text-white">
                                                        {selectedPreset.data.roles.reduce((sum: number, role: any) => sum + role.count, 0)}
                                                    </span> members
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                onClick={handleGenerateParties}
                            >
                                🎯 Generate Parties
                            </button>
                        </GlassBox>
                    )}

                    {/* Results Section - Full Width */}
                    {showResults && (
                        <>
                            {/* Results Header */}
                            <GlassBox className="p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-semibold">🎉 Generated Parties</h2>
                                        <p className="text-sm opacity-70 mt-1">Drag members between parties • Click role badges to change roles</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={addEmptyParty}
                                            className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 rounded-lg py-2 px-4 text-blue-300 border border-blue-500/30 text-sm"
                                        >
                                            ➕ Add Party
                                        </button>
                                        <button
                                            onClick={() => setShowResults(false)}
                                            className="bg-gray-500/20 hover:bg-gray-500/30 transition-colors duration-200 rounded-lg py-2 px-4 text-gray-300 border border-gray-500/30 text-sm"
                                        >
                                            🔄 Start Over
                                        </button>
                                    </div>
                                </div>
                            </GlassBox>

                            {/* Parties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {parties.map((party) => (
                                    <PartyContainer
                                        key={party.id}
                                        party={party}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragStart={handleDragStart}
                                        onRoleChange={handleRoleChange}
                                    />
                                ))}
                            </div>

                            {/* Unused Members Section */}
                            {unusedMembers.length > 0 && (
                                <GlassBox className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">👤 Unused Members</h2>
                                    <p className="text-sm opacity-70 mb-4">Drag these members into parties above</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {unusedMembers.map((member: any, index: number) => (
                                            <div
                                                key={index}
                                                draggable
                                                onDragStart={() => handleDragStart({
                                                    name: member.name,
                                                    role: 'FLEX',
                                                    availableRoles: member.roles,
                                                    userId: member.userId
                                                }, -1, index)}
                                                className="bg-black/30 rounded p-3 border border-white/10 cursor-grab active:cursor-grabbing hover:bg-black/40 transition-all duration-200 hover:scale-105"
                                            >
                                                <div className="text-sm font-medium">{member.name}</div>
                                                <div className="text-xs opacity-60 mt-1">
                                                    Available: {member.roles.join(', ')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassBox>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}