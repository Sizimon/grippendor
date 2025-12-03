interface CacheData {
    data: any;
    timestamp: number;
    expiry: number;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const sessionCache = {
    set: (key: string, data: any, duration: number = CACHE_DURATION): void => {
        const cacheData: CacheData = {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + duration,
        };

        try {
            sessionStorage.setItem(key, JSON.stringify(cacheData));
            console.log(`💾 Cached ${key} until ${new Date(cacheData.expiry).toLocaleTimeString()}`);
        } catch (error) {
            console.error('Error setting session cache:', error);
        }
    },

    get: (key: string): any | null => {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) {
                console.log(`🔍 No cache found for ${key}`);
                return null;
            }

            const cacheData: CacheData = JSON.parse(item);
            
            const now = Date.now();
            if (now > cacheData.expiry) {
                console.log(`⏰ Cache expired for ${key}. Age: ${Math.floor((now - cacheData.timestamp) / (1000 * 60))}min`);
                sessionStorage.removeItem(key); // Fix: was sessionStorage.remove()
                return null;
            }

            const ageMinutes = Math.floor((now - cacheData.timestamp) / (1000 * 60));
            console.log(`✅ Cache hit for ${key} (age: ${ageMinutes}min)`);
            return cacheData.data;
        } catch (error) {
            console.error('Error getting session cache:', error);
            sessionStorage.removeItem(key);
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
            config: !!sessionCache.get(`config_${guildId}`),
            events: !!sessionCache.get(`events_${guildId}`),
            members: !!sessionCache.get(`members_${guildId}`),
            presets: !!sessionCache.get(`presets_${guildId}`),
        };
    };

    return { clearGuildCache, getGuildCache };
};