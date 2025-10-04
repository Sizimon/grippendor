'use client';
import React from 'react';
import GlassBox from '@/shared/GlassBox';
import { useGuild } from '../../context/GuildProvider';
import { formatDateTime } from '@/features/guild/utils/formatDate';
import NxtBtn from '@/shared/NxtBtn';
import { useRouter, useParams } from 'next/navigation';
import Prism from "@/bits/Prism";

const Events: React.FC = () => {
    const router = useRouter();
    const { guildId } = useParams();
    const { events } = useGuild();

    // Separate upcoming and past events
    const now = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.event_date) > now)
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    const pastEvents = events
        .filter(event => new Date(event.event_date) <= now)
        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

    const EventCard = ({ event }: { event: any }) => (
        <GlassBox className="p-6 space-y-4 h-fit" onClick={() => router.push(`/${guildId}/events/${event.id}`)}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                        {event.name || 'Unnamed Event'}
                    </h3>
                    <div className="space-y-1 text-sm opacity-70">
                        <div className="flex items-center gap-2">
                            📅 <span>{formatDateTime(event.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            👥 <span>{event.max_attendees || 'Unlimited'} attendees</span>
                        </div>
                        {event.description && (
                            <div className="flex items-start gap-2 mt-3">
                                📝 <span className="opacity-60">{event.description}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-xs opacity-50 ml-4">
                    {new Date(event.event_date) > now ? (
                        <span className="text-green-400">● Upcoming</span>
                    ) : (
                        <span className="text-gray-400">● Past</span>
                    )}
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <NxtBtn
                    onClick={() => router.push(`/${guildId}/events/${event.id}`)}
                    className="flex-1 bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-lg py-2 px-4 text-sm text-center"
                >
                    View Details
                </NxtBtn>
            </div>
        </GlassBox>
    );

    return (
        <>
            {/* Fixed Prism Background */}
            <div className="fixed inset-0 z-0">
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

            {/* Events Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8">
                <div className="w-full max-w-6xl flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">Guild Events</h1>
                        <p className="text-lg font-light opacity-80">Manage and view all server events</p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm opacity-70">
                            {upcomingEvents.length} upcoming • {pastEvents.length} past events
                        </div>
                        <NxtBtn
                            onClick={() => router.push(`/${guildId}/events/create`)}
                            className="bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 rounded-lg py-2 px-6 text-sm"
                        >
                            ➕ Create Event
                        </NxtBtn>
                    </div>

                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">🔥 Upcoming Events</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {upcomingEvents.map((event, index) => (
                                    <EventCard key={event.id || index} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Events Section */}
                    {pastEvents.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">📚 Past Events</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {pastEvents.map((event, index) => (
                                    <EventCard key={event.id || index} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {events.length === 0 && (
                        <div className="text-center py-16">
                            <GlassBox className="p-8 max-w-md mx-auto">
                                <div className="text-6xl mb-4">📅</div>
                                <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
                                <p className="text-sm opacity-70 mb-6">
                                    Get started by creating your first guild event! (use "/create-event" command in Discord)
                                </p>
                            </GlassBox>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Events;