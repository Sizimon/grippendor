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

    console.log('Config:', config);
    console.log('Events:', events);

    const fetchWithCache = async (type: string, fetchFunction: () => Promise<any>, force = false) => {
        const cacheKey = `${type}_${guildId}`;
        
        // Check cache first (unless forced)
        if (!force) {
            const cached = sessionCache.get(cacheKey);
            if (cached) {
                console.log(`📦 ${type} loaded from cache`);
                return cached; 
            }
        }

        try {
            console.log(`🌐 Fetching fresh ${type} (cache ${force ? 'forced' : 'expired'})`);
            const data = await fetchFunction();
            
            // For config, sanitize before caching
            if (type === 'config' && data) {
                const { password, ...safeConfig } = data;
                sessionCache.set(cacheKey, safeConfig);
                return data; // Return full data to component
            } else {
                sessionCache.set(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.error(`❌ Failed to fetch ${type}:`, error);
            return null;
        }
    };

    const loadGuildData = async (force = false) => {
        if (!guildId) return;

        console.log(`Loading guild data (force: ${force})`);

        const results = await Promise.all([
            fetchWithCache('config', () => guildAPI.fetchConfig(guildId), force),
            fetchWithCache('members', () => guildAPI.fetchUserData(guildId), force),
            fetchWithCache('events', () => guildAPI.fetchEventData(guildId), force),
            fetchWithCache('presets', () => guildAPI.fetchPresets(guildId), force),
        ]);

        const [configData, membersData, eventsData, presetsData] = results;

        console.log('Fetched data:', { configData, membersData, eventsData, presetsData });

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

        console.log('Loading from cache on mount...');

        // Get cached data once and check if it exists (which means it's fresh)
        const configCache = sessionCache.get(`config_${guildId}`);
        const eventsCache = sessionCache.get(`events_${guildId}`);
        const membersCache = sessionCache.get(`members_${guildId}`);
        const presetsCache = sessionCache.get(`presets_${guildId}`);

        console.log('Cache data:', { configCache, eventsCache, membersCache, presetsCache });

        // Set cached data immediately for instant UI
        if (configCache) setConfig(configCache);
        if (eventsCache) setEvents(eventsCache);
        if (membersCache) setMembers(membersCache);
        if (presetsCache) setPresets(presetsCache);

        // If any cache is missing (expired caches return null), fetch fresh data
        const needsFetch = !configCache || !eventsCache || !membersCache || !presetsCache;
        
        console.log('Cache status:', { 
            configExists: !!configCache, 
            eventsExists: !!eventsCache, 
            membersExists: !!membersCache, 
            presetsExists: !!presetsCache,
            needsFetch
        });

        if (needsFetch) {
            console.log('Some cache is missing/expired, fetching fresh data...');
            loadGuildData(); // This will only fetch what's missing/expired
        } else {
            console.log('All cache is fresh, no fetch needed');
        }
    }, [guildId]);

    // Public refresh function
    const refreshData = async (force = false) => {
        console.log(`Manual refresh triggered (force: ${force})`);
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