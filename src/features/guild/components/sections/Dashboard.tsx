'use client';
import React from "react";
import Prism from "@/bits/Prism";
import NxtBtn from "@/shared/NxtBtn";
import GlassBox from "@/shared/GlassBox";
import { useGuild } from "../../context/GuildProvider";
import { formatDateTime } from '@/features/guild/utils/formatDate';

const Dashboard: React.FC = () => {
    const { config, events } = useGuild();
    const upcomingEvents = events
        .filter(event => new Date(event.event_date) > new Date()) // filter future events
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()); // Sort by earliest

    const nextEvent = upcomingEvents[0]
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
            {/* Dashboard Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-center items-center gap-8 p-4">
                <div className="w-full max-w-6xl flex flex-col justify-center items-center gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">Dashboard</h1>
                        <p className="text-lg font-light opacity-80">{config?.title}</p>
                    </div>

                    {/* Top Stats Section - Full Width */}
                    <div className="w-full max-w-5xl">
                        <GlassBox>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 text-center">📊 Guild Statistics</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-400">1,247</div>
                                        <div className="text-sm opacity-70">Total Members</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-400">433</div>
                                        <div className="text-sm opacity-70">Total Events</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-400">156</div>
                                        <div className="text-sm opacity-70">Messages Today</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-400">Warthunder</div>
                                        <div className="text-sm opacity-70">Most Played</div>
                                    </div>
                                </div>
                            </div>
                        </GlassBox>
                    </div>

                    {/* Dashboard Grid - 2x2 Layout with Analytics */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

                        {/* Events Card */}
                        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <GlassBox>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">📅 Events</h3>
                                        <div className="text-sm text-blue-400">●  2 This Week</div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm opacity-70">Upcoming server events and activities</p>
                                        {nextEvent ? (
                                            <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                                                <div className="text-sm font-medium">
                                                    🎮 {nextEvent.name || 'Unnamed Event'}
                                                </div>
                                                <div className="text-xs opacity-60">
                                                    {formatDateTime(nextEvent.event_date)}
                                                </div>
                                                <div className="text-xs opacity-60">
                                                     attendees
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                                                <div className="text-sm font-medium opacity-60">No upcoming events</div>
                                                <div className="text-xs opacity-40">Create your first event!</div>
                                            </div>
                                        )}
                                    </div>
                                    <NxtBtn
                                        href="/dashboard/events"
                                        className="w-full mt-4"
                                    >
                                        View Events
                                    </NxtBtn>
                                </div>
                            </GlassBox>
                        </div>

                        {/* Members Card */}
                        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <GlassBox>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">👥 Members</h3>
                                        <div className="text-sm text-purple-400">●  5 Active</div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm opacity-70">View detailed list of members & activity.</p>
                                        <div className="text-xs opacity-60">
                                            <div>Most Played Game: <span className="font-semibold">Warthunder</span></div>
                                            <div>Average Event Attendance: <span className="font-semibold">18 people</span></div>
                                        </div>
                                    </div>
                                    <NxtBtn
                                        href="/dashboard/party-maker"
                                        className="w-full mt-4"
                                    >
                                        View Members
                                    </NxtBtn>
                                </div>
                            </GlassBox>
                        </div>

                        {/* Guild Management Card */}
                        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <GlassBox>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">⚙️ Guild Management</h3>
                                        <div className="text-sm text-yellow-400">●  3 Pending</div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm opacity-70">Manage roles, channels, and settings</p>
                                        <div className="text-xs opacity-60">
                                            <div>Total roles: <span className="font-semibold">12</span></div>
                                            <div>Text channels: <span className="font-semibold">8</span></div>
                                        </div>
                                    </div>
                                    <NxtBtn
                                        href="/dashboard/guild-management"
                                        className="w-full mt-4"
                                    >
                                        Manage Guild
                                    </NxtBtn>
                                </div>
                            </GlassBox>
                        </div>

                        {/* Bot Settings Card */}
                        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <GlassBox>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">🤖 Bot Settings</h3>
                                        <div className="text-sm text-green-400">●  Active</div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm opacity-70">Configure bot behavior and permissions</p>
                                        <div className="text-xs opacity-60">
                                            <div>Commands executed today: <span className="font-semibold">47</span></div>
                                            <div>Bot uptime: <span className="font-semibold">99.8%</span></div>
                                        </div>
                                    </div>
                                    <NxtBtn
                                        href="/dashboard/bot-settings"
                                        className="w-full mt-4"
                                    >
                                        Configure Bot
                                    </NxtBtn>
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