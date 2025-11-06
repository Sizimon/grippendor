
// Define Auth Types
export interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    isLoading: boolean;
    guild: guild | null;
    setGuild: (guild: guild | null) => void;
    login: (guildId: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

// GUILD CONTEXT TYPE

export interface GuildContextType {
    config: config | null;
    members: user[],
    events: event[],
    presets: preset[]
}

// GUILD CONFIG TYPE

export interface guild {
    id: string;
}

export interface config {
    channel?: string;
    color?: string; // remove later
    icon?: string; // remove  later?
    title?: string;
    banner?: string; // remove later
}

// USER TYPE

export interface user {
    guild_id: string;
    user_id: string;
    username: string;
}

// EVENT TYPE

export interface eventUser {
    user_id: string;
    name: string;
    roles: string[];
}

export interface event {
    id: string;
    guild_id: string;
    channel_id: string;
    message_id: string;
    name: string;
    description: string;
    event_date: string; // ISO date string
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    debrief: string;
    type: string;
    summary: string;
    thumbnail_url: string;
    image_urls: string[]; // or string if your DB stores as a comma-separated string
    game_id: string;
    game_name: string;
}

// PRESET TYPES

export interface PresetRole {
    count: number;
    role_id: string;
    role_name: string;
}

export interface PresetData {
    roles: PresetRole[];
}

export interface preset {
    id: string;
    guild_id: string;
    preset_name: string;
    game_role_name: string;
    game_role_id: string;
    party_size: number;
    data: PresetData;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}
