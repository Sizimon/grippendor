'use client';
import React, { useState } from 'react';
import GlassBox from '@/shared/GlassBox';
import { useGuild } from '../../context/GuildProvider';
import { formatDateTime } from '@/features/guild/utils/formatDate';
import NxtBtn from '@/shared/NxtBtn';
import { useRouter, useParams } from 'next/navigation';
import Prism from "@/bits/Prism";
import { BackgroundVideo } from '../ui/BackgroundVideo';

const Events: React.FC = () => {
    const router = useRouter();
    const { guildId } = useParams();
    const { events } = useGuild();

    // State for event view toggle - default to upcoming
    const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming');

    // Separate upcoming and past events
    const now = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.event_date) > now)
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    const pastEvents = events
        .filter(event => new Date(event.event_date) <= now)
        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

    // Get current events to display based on view mode
    const currentEvents = viewMode === 'upcoming' ? upcomingEvents : pastEvents;

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
                            👥 Accepting more players {/* Add a property to events which allows admins to turn off RSVP if the event is full. Then display the current RSVP status */}
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
                <BackgroundVideo />
            </div>

            {/* Events Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8 relative z-10">
                <div className="w-full max-w-6xl flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">Guild Events</h1>
                        <p className="text-lg font-light opacity-80">Manage and view all server events</p>
                    </div>

                    {/* Event Toggle Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* View Toggle */}
                        <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                            <button
                                onClick={() => setViewMode('upcoming')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'upcoming'
                                        ? 'bg-blue-500/30 text-blue-300 shadow-lg'
                                        : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                                    }`}
                            >
                                🔥 Upcoming ({upcomingEvents.length})
                            </button>
                            <button
                                onClick={() => setViewMode('past')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'past'
                                        ? 'bg-gray-500/30 text-gray-300 shadow-lg'
                                        : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                                    }`}
                            >
                                📚 Past ({pastEvents.length})
                            </button>
                        </div>

                        {/* Total Count */}
                        <div className="text-sm opacity-70">
                            Total Events: {events.length}
                        </div>
                    </div>

                    {/* Events Grid */}
                    {currentEvents.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    {viewMode === 'upcoming' ? '🔥 Upcoming Events' : '📚 Past Events'}
                                </h2>
                                <div className="text-sm opacity-60">
                                    {currentEvents.length} {currentEvents.length === 1 ? 'event' : 'events'}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {currentEvents.map((event, index) => (
                                    <EventCard key={event.id || index} event={event} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Empty State for Current View */
                        <div className="text-center py-16">
                            <GlassBox className="p-8 max-w-md mx-auto">
                                <div className="text-6xl mb-4">
                                    {viewMode === 'upcoming' ? '📅' : '📚'}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {viewMode === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
                                </h3>
                                <p className="text-sm opacity-70 mb-6">
                                    {viewMode === 'upcoming'
                                        ? 'No events are currently scheduled. Create your first event using the "/create-event" command in Discord!'
                                        : "No past events to display. Once events are completed, they'll appear here."
                                    }
                                </p>
                                {viewMode === 'past' && upcomingEvents.length > 0 && (
                                    <NxtBtn
                                        onClick={() => setViewMode('upcoming')}
                                        className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 rounded-lg py-2 px-4 text-sm"
                                    >
                                        View Upcoming Events
                                    </NxtBtn>
                                )}
                            </GlassBox>
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