'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GlassBox from '@/shared/GlassBox';
import NxtBtn from '@/shared/NxtBtn';
import Prism from "@/bits/Prism";
import { useGuild } from '../../context/GuildProvider';
import { formatDateTime } from '@/features/guild/utils/formatDate';

const EventPage: React.FC = () => {
    const router = useRouter();
    const { guildId, eventId } = useParams();
    const { events } = useGuild();

    console.log(guildId)

    // Find the specific event - handle both string and number IDs
    const event = events.find(e => {
        // Convert both to strings for comparison since URL params are always strings
        return String(e.id) === String(eventId);
    });

    // Image slideshow state - ensure eventImages is always an array
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const eventImages = Array.isArray(event?.image_urls) ? event.image_urls : [];

    // Auto-advance slideshow
    useEffect(() => {
        if (eventImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % eventImages.length);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [eventImages.length]);

    const nextImage = () => {
        if (eventImages.length > 0) {
            setCurrentImageIndex(prev => (prev + 1) % eventImages.length);
        }
    };

    const prevImage = () => {
        if (eventImages.length > 0) {
            setCurrentImageIndex(prev => (prev - 1 + eventImages.length) % eventImages.length);
        }
    };

    // Loading state - check if events are still loading
    if (events.length === 0) {
        return (
            <>
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

            {/* Event Page Content */}
            <div className="relative z-10 flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8">
                <div className="w-full max-w-6xl flex flex-col gap-8">

                    {/* Back Navigation */}
                    <div className="flex items-center gap-2">
                        <NxtBtn
                            onClick={() => router.push(`/${guildId}/events`)}
                            className="bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-lg py-2 px-4 text-sm cursor-pointer"
                        >
                            ← Back to Events
                        </NxtBtn>
                    </div>

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
                                <h2 className="text-xl font-semibold">👥 Attendees</h2>
                                <div className="text-sm opacity-70">
                                    Coming Soon
                                </div>
                            </div>
                            <div className="text-center py-12 opacity-60">
                                <div className="text-4xl mb-4">👤</div>
                                <p className="text-sm mb-2">Attendee management</p>
                                <p className="text-xs opacity-60">Feature under development</p>
                            </div>
                        </GlassBox>
                    </div>

                    {/* Full Width Image Gallery Section - Only if images exist and is array */}
                    {eventImages.length > 0 && (
                        <div className="max-w-5xl mx-auto w-full">
                            <GlassBox className="p-6">
                                <h2 className="text-xl font-semibold mb-6 text-center">🖼️ Event Gallery</h2>

                                <div className="space-y-6">
                                    {/* Main Image Display */}
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                                        <img
                                            src={eventImages[currentImageIndex]}
                                            alt={`Event image ${currentImageIndex + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        
                                        {/* Navigation Arrows */}
                                        {eventImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-3 transition-colors"
                                                >
                                                    ⬅️
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-3 transition-colors"
                                                >
                                                    ➡️
                                                </button>
                                            </>
                                        )}
                                        {/* Image Counter */}
                                        {eventImages.length > 1 && (
                                            <div className="absolute bottom-4 right-4 bg-black/70 rounded-full px-4 py-2 text-sm">
                                                {currentImageIndex + 1} / {eventImages.length}
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnail Grid - Show all images as thumbnails */}
                                    {eventImages.length > 1 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {eventImages.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${index === currentImageIndex
                                                            ? 'border-blue-400 ring-2 ring-blue-400/30'
                                                            : 'border-white/20 hover:border-white/40'
                                                        }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </GlassBox>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventPage;