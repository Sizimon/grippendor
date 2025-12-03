'use client';
import React from "react";

import GlassBox from "@/shared/GlassBox";
import { useGuild } from "../../context/GuildProvider";
import { formatDateTime } from '@/features/guild/utils/formatDate';
import { useRouter, useParams } from 'next/navigation'
import { BackgroundVideo } from "../ui/BackgroundVideo";

const Dashboard: React.FC = () => {
    const router = useRouter();
    const { guildId } = useParams();

    const { config, events, members, presets, refreshData } = useGuild();

    const upcomingEvents = events
        .filter(event => new Date(event.event_date) > new Date())
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    const recentEvents = events
        .filter(event => new Date(event.event_date) <= new Date())
        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
        .slice(0, 3);

    const nextEvent = upcomingEvents[0];
    const thisWeekEvents = upcomingEvents.filter(event => {
        const eventDate = new Date(event.event_date);
        const today = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(today.getDate() + 7);
        return eventDate >= today && eventDate <= weekFromNow;
    });

    return (
        <>
            {/* Fixed Background */}
            <div className="fixed inset-0 z-0">
                <BackgroundVideo />
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8 relative z-10">
                <div className="w-full max-w-7xl flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">Dashboard</h1>
                        <p className="text-lg font-light opacity-80">{config?.title || 'Welcome to your guild'}</p>
                    </div>

                    {/* Top Stats Grid - 4 Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GlassBox className="text-center p-4">
                            <div className="text-2xl md:text-3xl font-bold text-blue-400">{members.length}</div>
                            <div className="text-sm opacity-70">Total Members</div>
                        </GlassBox>
                        <GlassBox className="text-center p-4">
                            <div className="text-2xl md:text-3xl font-bold text-green-400">{upcomingEvents.length}</div>
                            <div className="text-sm opacity-70">Upcoming Events</div>
                        </GlassBox>
                        <GlassBox className="text-center p-4">
                            <div className="text-2xl md:text-3xl font-bold text-purple-400">{presets.length}</div>
                            <div className="text-sm opacity-70">Party Presets</div>
                        </GlassBox>
                        <GlassBox className="text-center p-4">
                            <div className="text-2xl md:text-3xl font-bold text-orange-400">{thisWeekEvents.length}</div>
                            <div className="text-sm opacity-70">This Week</div>
                        </GlassBox>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column - Events Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <GlassBox className="p-6">
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <span>⚡</span>
                                    <span>Quick Actions</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => router.push(`/${guildId}/events`)}
                                        className="p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-all duration-200 text-left group cursor-pointer"
                                    >
                                        <div className="text-2xl mb-2 group-hover:scale-105 transition-transform">📅</div>
                                        <div className="font-medium">View Events</div>
                                        <div className="text-xs opacity-70">Browse all events</div>
                                    </button>
                                    <button 
                                        onClick={() => router.push(`/${guildId}/party-planner`)}
                                        className="p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-all duration-200 text-left group cursor-pointer"
                                    >
                                        <div className="text-2xl mb-2 group-hover:scale-105 transition-transform">🎯</div>
                                        <div className="font-medium">Party Planner</div>
                                        <div className="text-xs opacity-70">Create parties</div>
                                    </button>
                                </div>
                            </GlassBox>

                            {/* Upcoming Events */}
                            <GlassBox className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <span>🎮</span>
                                        <span>Upcoming Events</span>
                                    </h3>
                                    <button 
                                        onClick={() => router.push(`/${guildId}/events`)}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        View All →
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {upcomingEvents.length > 0 ? (
                                        upcomingEvents.slice(0, 3).map((event, index) => (
                                            <div 
                                                key={index}
                                                onClick={() => router.push(`/${guildId}/events/${event.id}`)}
                                                className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 cursor-pointer transition-all duration-200 group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-medium group-hover:text-blue-400 transition-colors">
                                                            {event.name || 'Unnamed Event'}
                                                        </div>
                                                        <div className="text-sm opacity-70 mt-1">
                                                            {formatDateTime(event.event_date)}
                                                        </div>
                                                        {event.summary && (
                                                            <div className="text-xs opacity-60 mt-2">
                                                                {event.summary.slice(0, 80)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                        Open
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 opacity-60">
                                            <div className="text-4xl mb-3">📭</div>
                                            <div className="text-sm">No upcoming events</div>
                                            <div className="text-xs opacity-70">Create your first event!</div>
                                        </div>
                                    )}
                                </div>
                            </GlassBox>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Next Event Spotlight */}
                            {nextEvent && (
                                <GlassBox className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span>🌟</span>
                                        <span>Next Event</span>
                                    </h3>
                                    <div 
                                        onClick={() => router.push(`/${guildId}/events/${nextEvent.id}`)}
                                        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30 cursor-pointer hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200"
                                    >
                                        <div className="font-medium text-blue-300 mb-2">
                                            {nextEvent.name}
                                        </div>
                                        <div className="text-sm opacity-80 mb-3">
                                            {formatDateTime(nextEvent.event_date)}
                                        </div>
                                        {nextEvent.game_name && (
                                            <div className="text-xs bg-white/10 rounded px-2 py-1 inline-block">
                                                🎮 {nextEvent.game_name}
                                            </div>
                                        )}
                                    </div>
                                </GlassBox>
                            )}

                            {/* Recent Activity */}
                            <GlassBox className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span>📈</span>
                                    <span className="text-cyan-500">Recent Activity</span>
                                </h3>
                                <div className="space-y-3">
                                    {recentEvents.length > 0 ? (
                                        recentEvents.map((event, index) => (
                                            <div onClick={() => router.push(`/${guildId}/events/${event.id}`)} key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg hover:scale-105 transition-transform cursor-pointer">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium">
                                                        {event.name}
                                                    </div>
                                                    <div className="text-xs opacity-60">
                                                        Completed • {new Date(event.event_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 opacity-60">
                                            <div className="text-sm">No recent events</div>
                                        </div>
                                    )}
                                </div>
                            </GlassBox>

                            {/* Guild Info */}
                            <GlassBox className="p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <span>🏰</span>
                                    <span className="text-cyan-500">Guild Info</span>
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Guild Name:</span>
                                        <span className="text-sm font-medium">{config?.title || 'Unnamed Guild'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Total Events:</span>
                                        <span className="text-sm font-medium">{events.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Active Presets:</span>
                                        <span className="text-sm font-medium">{presets.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm opacity-70">Member Count:</span>
                                        <span className="text-sm font-medium">{members.length}</span>
                                    </div>
                                </div>
                            </GlassBox>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;