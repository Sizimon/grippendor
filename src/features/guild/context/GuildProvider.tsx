'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { guildAPI } from '@/features/guild/api/api';
import { GuildContextType, user, event, preset, config } from '@/types/types';

const GuildContext = createContext<GuildContextType | undefined>(undefined); 

export const GuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { guild } = useAuth();
    const guildId = guild?.id;

    const [config, setConfig] = useState<config | null>(null);
    const [members, setMembers] = useState<user[]>([]);
    const [events, setEvents] = useState<event[]>([]);
    const [presets, setPresets] = useState<preset[]>([]);

    useEffect(() => {
        if (!guildId) {
            console.log('No guild ID found');
            return;
        }

        const fetchData = async () => {
            try {
                const [configData, membersData, eventsData, presetsData] = await Promise.all([
                    guildAPI.fetchConfig(guildId),
                    guildAPI.fetchUserData(guildId),
                    guildAPI.fetchEventData(guildId),
                    guildAPI.fetchPresets(guildId),
                ]);
                console.log('Guild data loading completed successfully');
                setConfig(configData);
                setMembers(membersData);
                setEvents(eventsData);
                setPresets(presetsData);
            } catch (error) {
                console.error('Error fetching guild data:', error);
                console.error('Error details:', {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    guildId,
                });
            }
        };
        fetchData();
    }, [guildId]);

    return (
        <GuildContext.Provider value={{ config, members, events, presets }}>
            {children}
        </GuildContext.Provider>
    );
};

export const useGuild = (): GuildContextType => {
    const context = useContext(GuildContext);
    if (!context) {
        throw new Error('useGuild must be used within a GuildProvider');
    }
    return context;
};