interface CacheData {
    data: any;
    timestamp: number;
    expiry: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const sessionCache = {
    set: (key: string, data: any, duration: number = CACHE_DURATION): void => {
        const cacheData: CacheData = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + duration,
        };

        try {
            sessionStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error setting session cache:', error);
        }
    },

    get: (key: string): any | null => {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) return null;

            const cacheData: CacheData = JSON.parse(item);
            
            if (Date.now() - cacheData.timestamp > cacheData.expiry) {
                sessionStorage.remove(key);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.error('Error getting session cache:', error);
            return null;
        }
    },

    remove: (key: string): void => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.warn('SessionStorage remove failed:', error);
        }
    },

    clear: (): void => {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.warn('SessionStorage clear failed:', error);
        }
    }
}

export const useSessionCache = (guildId: string | undefined) => {
    const clearGuildCache = () => {
        if (!guildId) return;
        sessionCache.remove(`config_${guildId}`);
        sessionCache.remove(`members_${guildId}`);
        sessionCache.remove(`events_${guildId}`);
        sessionCache.remove(`presets_${guildId}`);
    };

    const getGuildCache = () => {
        if (!guildId) return {};

        return {
            config: !!sessionCache.get(`guild_${guildId}_config`),
            events: !!sessionCache.get(`guild_${guildId}_events`),
            members: !!sessionCache.get(`guild_${guildId}_members`),
            presets: !!sessionCache.get(`guild_${guildId}_presets`),
        };
    };

    return { clearGuildCache, getGuildCache };
};