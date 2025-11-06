'use client';
import React, { useState, useMemo } from 'react';
import Prism from "@/bits/Prism";
import GlassBox from "@/shared/GlassBox";
import { useGuild } from "../../context/GuildProvider";
import { useAuth } from '@/features/auth/context/AuthProvider';

interface Member {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    status: 'online' | 'offline' | 'idle' | 'dnd';
    roles: string[];
    joinedAt: string;
    lastSeen?: string;
}

type SortOption = 'alphabetical' | 'status' | 'roles' | 'joinDate';

// Mock data - replace with real data from your API
const mockMembers: Member[] = [
    {
        id: '1',
        name: 'Napocalypse',
        username: 'napocalypse',
        status: 'online',
        roles: ['DPS', 'HEALER'],
        joinedAt: '2023-01-15T10:30:00Z',
        lastSeen: '2024-11-06T14:30:00Z'
    },
    {
        id: '2',
        name: 'Tank Master',
        username: 'tankmaster',
        status: 'offline',
        roles: ['TANK'],
        joinedAt: '2023-02-20T15:45:00Z',
        lastSeen: '2024-11-05T20:15:00Z'
    },
    {
        id: '3',
        name: 'Healer Pro',
        username: 'healerpro',
        status: 'idle',
        roles: ['HEALER', 'SUPPORT'],
        joinedAt: '2023-03-10T08:20:00Z',
        lastSeen: '2024-11-06T12:00:00Z'
    },
    // Add more mock members as needed
];

const MemberCard: React.FC<{ member: Member }> = ({ member }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500';
            case 'dnd': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'DPS': return 'bg-red-500/30 text-red-300 border-red-500/30';
            case 'HEALER': return 'bg-green-500/30 text-green-300 border-green-500/30';
            case 'TANK': return 'bg-blue-500/30 text-blue-300 border-blue-500/30';
            case 'SUPPORT': return 'bg-purple-500/30 text-purple-300 border-purple-500/30';
            default: return 'bg-gray-500/30 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <GlassBox className="p-4 hover:bg-white/5 transition-all duration-200">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Status indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(member.status)}`}></div>
                </div>

                {/* Member info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{member.name}</h3>
                        <span className="text-sm text-white/60">@{member.username}</span>
                    </div>
                    
                    {/* Roles */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {member.roles.map((role, index) => (
                            <span
                                key={index}
                                className={`text-xs px-2 py-1 rounded border font-medium ${getRoleColor(role)}`}
                            >
                                {role}
                            </span>
                        ))}
                    </div>

                    {/* Member stats */}
                    <div className="text-xs text-white/50 space-y-1">
                        <div>Joined: {new Date(member.joinedAt).toLocaleDateString()}</div>
                        {member.lastSeen && (
                            <div>Last seen: {new Date(member.lastSeen).toLocaleDateString()}</div>
                        )}
                    </div>
                </div>

                {/* Status text */}
                <div className="text-sm">
                    <span className={`capitalize ${
                        member.status === 'online' ? 'text-green-400' :
                        member.status === 'idle' ? 'text-yellow-400' :
                        member.status === 'dnd' ? 'text-red-400' :
                        'text-gray-400'
                    }`}>
                        {member.status === 'dnd' ? 'Do Not Disturb' : member.status}
                    </span>
                </div>
            </div>
        </GlassBox>
    );
};

export function MemberPage() {
    const { members } = useGuild();
    const { guild } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Use mock data for now - replace with real members data
    const allMembers = mockMembers; // Replace with: members || mockMembers

    // Filter and sort members
    const filteredAndSortedMembers = useMemo(() => {
        let filtered = allMembers.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                member.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesOnlineFilter = !showOnlineOnly || member.status === 'online';
            
            return matchesSearch && matchesOnlineFilter;
        });

        // Sort members
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'alphabetical':
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                
                case 'status':
                    const statusOrder = { online: 0, idle: 1, dnd: 2, offline: 3 };
                    return statusOrder[a.status] - statusOrder[b.status];
                
                case 'roles':
                    return a.roles.length - b.roles.length;
                
                case 'joinDate':
                    return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
                
                default:
                    return 0;
            }
        });

        return filtered;
    }, [allMembers, searchTerm, sortBy, showOnlineOnly]);

    const onlineCount = allMembers.filter(m => m.status === 'online').length;
    const totalCount = allMembers.length;

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

            {/* Members Content */}
            <div className="flex flex-col min-h-screen bg-transparent text-default w-full justify-start items-center gap-8 p-4 pt-8 relative z-10">
                <div className="w-full max-w-6xl flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-extralight mb-2">👥 Guild Members</h1>
                        <p className="text-lg font-light opacity-80">
                            {onlineCount} online • {totalCount} total members
                        </p>
                    </div>

                    {/* Search and Filter Controls */}
                    <GlassBox className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <svg 
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search members by name, username, or roles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Sort Controls */}
                            <div className="flex gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                                >
                                    <option value="alphabetical">Sort A-Z</option>
                                    <option value="status">Sort by Status</option>
                                    <option value="roles">Sort by Role Count</option>
                                    <option value="joinDate">Sort by Join Date</option>
                                </select>

                                {/* Online Only Toggle */}
                                <button
                                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                                    className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        showOnlineOnly 
                                            ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                                            : 'bg-black/20 border-white/20 text-white/70 hover:bg-white/5'
                                    }`}
                                >
                                    🟢 Online Only
                                </button>
                            </div>
                        </div>

                        {/* Filter Summary */}
                        <div className="mt-4 text-sm text-white/60">
                            Showing {filteredAndSortedMembers.length} of {totalCount} members
                            {searchTerm && (
                                <span className="ml-2">
                                    • Searching for "{searchTerm}"
                                </span>
                            )}
                            {showOnlineOnly && (
                                <span className="ml-2">
                                    • Online only
                                </span>
                            )}
                        </div>
                    </GlassBox>

                    {/* Members List */}
                    <div className="space-y-4">
                        {filteredAndSortedMembers.length > 0 ? (
                            filteredAndSortedMembers.map((member) => (
                                <MemberCard key={member.id} member={member} />
                            ))
                        ) : (
                            <GlassBox className="p-12 text-center">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">No members found</h3>
                                <p className="text-white/60">
                                    {searchTerm 
                                        ? `No members match "${searchTerm}"`
                                        : showOnlineOnly 
                                            ? "No members are currently online"
                                            : "No members in this guild"
                                    }
                                </p>
                                {(searchTerm || showOnlineOnly) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setShowOnlineOnly(false);
                                        }}
                                        className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 rounded-lg text-blue-300 border border-blue-500/30"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </GlassBox>
                        )}
                    </div>

                    {/* Stats Summary */}
                    <GlassBox className="p-6">
                        <h3 className="text-lg font-semibold mb-4">📊 Guild Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">{onlineCount}</div>
                                <div className="text-sm text-white/60">Online</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{totalCount}</div>
                                <div className="text-sm text-white/60">Total Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-400">
                                    {allMembers.filter(m => m.roles.includes('DPS')).length}
                                </div>
                                <div className="text-sm text-white/60">DPS Players</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                    {allMembers.filter(m => m.roles.includes('TANK')).length}
                                </div>
                                <div className="text-sm text-white/60">Tank Players</div>
                            </div>
                        </div>
                    </GlassBox>
                </div>
            </div>
        </>
    );
}