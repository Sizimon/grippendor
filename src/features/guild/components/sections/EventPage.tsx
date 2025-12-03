'use client';
import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GlassBox from '@/shared/GlassBox';
import NxtBtn from '@/shared/NxtBtn';
import { useGuild } from '../../context/GuildProvider';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { formatDateTime } from '@/features/guild/utils/formatDate';
import { guildAPI } from '../../api/api';
import { BackgroundVideo } from '../ui/BackgroundVideo';

const EventPage: React.FC = () => {
    const router = useRouter();
    const { eventId } = useParams();
    const { fetchEventUserData } = guildAPI;
    const { events } = useGuild();
    const { guild } = useAuth();


    const [eventParticipants, setEventParticipants] = useState<any[]>([]);

    console.log('Event Participants:', eventParticipants);

    const guildId = guild?.id;

    // Find the specific event - handle both string and number IDs
    const event = events.find(e => {
        // Convert both to strings for comparison since URL params are always strings
        return String(e.id) === String(eventId);
    });

    useEffect(() => {
        if (event && guildId) {
            const fetchData = async () => {
                try {
                    const eventUserData = await fetchEventUserData(guildId, event.id);
                    setEventParticipants(eventUserData.data || []);
                } catch (error) {
                    console.error("Error fetching event participants:", error);
                }
            };
            fetchData();
        }
    }, [event, guildId]);


    // Function which generates a consistent color for a makeshift avatar based on user name
    const generateUserColor = (name: string) => {
        const colors = [
            'from-blue-500 to-purple-600',
            'from-green-500 to-teal-600',
            'from-red-500 to-pink-600',
            'from-yellow-500 to-orange-600',
            'from-purple-500 to-indigo-600',
            'from-teal-500 to-cyan-600',
            'from-pink-500 to-rose-600',
            'from-indigo-500 to-blue-600',
        ];

        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    // Function to generate HSL-based colors for roles
    const generateRoleColorHSL = (role: string) => {
        // Generate consistent hue based on role name
        const hash = role.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360; // 0-359 degrees on color wheel

        return {
            bg: `hsl(${hue}, 60%, 15%)`, // Dark background
            text: `hsl(${hue}, 70%, 70%)`, // Light text
            border: `hsl(${hue}, 60%, 40%)` // Medium border
        };
    };

    // Loading state - check if guild is still loading
    if (!guildId) {
        return (
            <>
                <div className="fixed inset-0 -z-10">
                    <BackgroundVideo />
                </div>
                <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-center items-center p-4 relative z-10">
                    <GlassBox className="p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">Loading Guild...</h2>
                        <p className="text-sm opacity-70">Please wait while we load guild data.</p>
                    </GlassBox>
                </div>
            </>
        );
    }

    // Loading state - check if events are still loading
    if (events.length === 0) {
        return (
            <>
                <div className="fixed inset-0 z-0">
                    <BackgroundVideo />
                </div>

                <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-center items-center p-4">
                    <GlassBox className="p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">Loading Events...</h2>
                        <p className="text-sm opacity-70">Please wait while we load event data.</p>
                    </GlassBox>
                </div>
            </>
        );
    }

    // Event not found
    if (!event) {
        return (
            <>
                <div className="fixed inset-0 z-0">
                    <BackgroundVideo />
                </div>

                <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-center items-center p-4">
                    <GlassBox className="p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
                        <p className="text-sm opacity-70 mb-4">
                            Event ID "{eventId}" could not be found.
                        </p>
                        <div className="text-xs opacity-50 mb-4">
                            Available events: {events.map(e => `ID:${e.id}`).join(', ')}
                        </div>
                        <NxtBtn
                            onClick={() => router.push(`/${guildId}/events`)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 rounded-lg py-2 px-6"
                        >
                            Back to Events
                        </NxtBtn>
                    </GlassBox>
                </div>
            </>
        );
    }

    const isUpcoming = new Date(event.event_date) > new Date();

    return (
        <>
            {/* Fixed Prism Background */}
            <div className="fixed inset-0 z-0">
                <BackgroundVideo />
            </div>

            {/* Event Page Content */}
            <div className="relative z-10 flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8">
                <div className="w-full max-w-6xl flex flex-col gap-8">
                    {/* Event Header - Title, Time & Summary */}
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-extralight">
                                {event.name || 'Event Details'}
                            </h1>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg font-light opacity-80">
                                <div className="flex items-center gap-2">
                                    📅 <span>{formatDateTime(event.event_date)}</span>
                                </div>
                                <div className={`text-sm px-3 py-1 rounded-full ${isUpcoming
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-gray-500/20 text-gray-300'
                                    }`}>
                                    {isUpcoming ? 'Upcoming' : 'Past Event'}
                                </div>
                            </div>
                        </div>

                        {/* Event Summary/Brief Description */}
                        {event.summary && (
                            <div className="max-w-3xl mx-auto">
                                <p className="text-lg opacity-70 leading-relaxed">
                                    {event.summary}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Event Content Grid - Description & Attendees */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">

                        {/* Left Column - Event Description */}
                        <GlassBox className="p-6 space-y-4 h-fit">
                            <h2 className="text-xl font-semibold mb-4">📝 Event Description</h2>

                            {event.description ? (
                                <div className="space-y-4">
                                    <p className="text-sm leading-relaxed opacity-80">
                                        {event.description}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8 opacity-60">
                                    <p className="text-sm">No detailed description available for this event.</p>
                                </div>
                            )}

                            {/* Event Details */}
                            <div className="border-t border-white/10 pt-4 mt-6">
                                <h3 className="text-lg font-medium mb-3">Event Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="opacity-70">Full Date & Time:</span>
                                        <span>{formatDateTime(event.event_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-70">Status:</span>
                                        <span className={isUpcoming ? 'text-green-400' : 'text-gray-400'}>
                                            {isUpcoming ? 'Open for Registration' : 'Event Completed'}
                                        </span>
                                    </div>
                                    {event.game_name && (
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Game:</span>
                                            <span>{event.game_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassBox>

                        {/* Right Column - Event Attendees */}
                        <GlassBox className="p-6 space-y-4 h-fit">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">👥 Participants</h2>
                                <div className="text-sm opacity-70">
                                    {eventParticipants.length} Participants
                                </div>
                            </div>
                            {eventParticipants.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto space-y-3">
                                    {eventParticipants.map((participant, index) => (
                                        <div
                                            key={participant.user_id}
                                            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {/* Generated Avatar */}
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${generateUserColor(participant.name)} flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                                                    {participant.name.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{participant.name}</span>
                                                    {participant.roles && participant.roles.length > 0 && (
                                                        <div className="flex gap-1 mt-1 flex-wrap">
                                                            {participant.roles.slice(0, 3).map((role: string, roleIndex: number) => {
                                                                const roleStyle = generateRoleColorHSL(role);
                                                                return (
                                                                    <span
                                                                        key={roleIndex}
                                                                        className='text-xs px-1.5 py-0.5 rounded border'
                                                                        style={{
                                                                            backgroundColor: roleStyle.bg,
                                                                            color: roleStyle.text,
                                                                            borderColor: roleStyle.border,
                                                                        }}
                                                                    >
                                                                        {role}
                                                                    </span>
                                                                );
                                                            })}
                                                            {participant.roles.length > 3 && (
                                                                <span className="text-xs text-gray-400 px-1">
                                                                    +{participant.roles.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Join indicator */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-gray-400">Joined</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 opacity-60">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <p className="text-sm mb-2">Ready for Adventure</p>
                                    <p className="text-xs opacity-60">Waiting for participants to join</p>
                                </div>
                            )}
                        </GlassBox>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventPage;