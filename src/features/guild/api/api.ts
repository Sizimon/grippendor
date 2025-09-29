import { apiRequest } from "@/lib/api";

export const guildAPI = {
    fetchConfig: (guildId: string) =>
        apiRequest(`/guilds/config/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchUserData: (guildId: string) =>
        apiRequest(`/guilds/userdata/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchEventData: (guildId: string) =>
        apiRequest(`/guilds/eventdata/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchEventUserData: (guildId: string, eventId: string) =>
        apiRequest(`/guilds/eventuserdata/${guildId}/${eventId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchPresets: (guildId: string) =>
        apiRequest(`/guilds/presets/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        })
}