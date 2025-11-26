'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { guildAPI } from '@/features/guild/api/api';
import { GuildContextType, user, event, preset, config } from '@/types/types';
import { sessionCache } from '../utils/cacheData';

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export const GuildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<config | null>(null);
    const [members, setMembers] = useState<user[]>([]);
    const [events, setEvents] = useState<event[]>([]);
    const [presets, setPresets] = useState<preset[]>([]);

    const { guild } = useAuth();
    const guildId = guild?.id;

    console.log(config)

        const fetchWithCache = async (type: string, fetchFunction: () => Promise<any>, force = false) => {
            const cacheKey = `${type}_${guildId}`;
            if (!force) {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    console.log(`📦 ${type} loaded from cache`);
                    return cached;
                }
            }

            try {
                console.log(`🌐 Fetching ${type}`);
                const data = await fetchFunction();
                sessionCache.set(cacheKey, data);
                return data;
            } catch (error) {
                console.error(`❌ Failed to fetch ${type}:`, error);
                return null;
            }
        }

        const loadGuildData = async (force = false) => {
            if (!guildId) return;

            const results = await Promise.all([
                fetchWithCache('config', () => guildAPI.fetchConfig(guildId), force),
                fetchWithCache('members', () => guildAPI.fetchUserData(guildId), force),
                fetchWithCache('events', () => guildAPI.fetchEventData(guildId), force),
                fetchWithCache('presets', () => guildAPI.fetchPresets(guildId), force),
            ]);

            const [configData, membersData, eventsData, presetsData] = results;

            if (configData) {
                const { password, ...cleanConfig } = configData;
                setConfig(cleanConfig);
            }
            if (membersData) setMembers(membersData);
            if (eventsData) setEvents(eventsData);
            if (presetsData) setPresets(presetsData);
        };

     // Load cached data immediately on mount
    useEffect(() => {
        if (!guildId) return;

        // Load from cache first
        const configCache = sessionCache.get(`config_${guildId}`);
        const eventsCache = sessionCache.get(`events_${guildId}`);
        const membersCache = sessionCache.get(`members_${guildId}`);
        const presetsCache = sessionCache.get(`presets_${guildId}`);

        if (configCache) {
            const { password, ...cleanConfig } = configCache;
            setConfig(cleanConfig);
        }
        if (eventsCache) setEvents(eventsCache);
        if (membersCache) setMembers(membersCache);
        if (presetsCache) setPresets(presetsCache);

        // If data missing fetch it
        const needsFetch = !configCache || !eventsCache || !membersCache || !presetsCache;
        if (needsFetch) {
            loadGuildData();
        }
    }, [guildId]);

    // Public refresh function
    const refreshData = async (force = false) => {
        await loadGuildData(force);
    };

    const value: GuildContextType = {
        config,
        events,
        members,
        presets,
        refreshData,
    };

    return (
        <GuildContext.Provider value={value}>
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