import { apiRequest } from "@/lib/api";

export const guildAPI = {
    fetchConfig: (guildId: string) =>
        apiRequest(`/config/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchUserData: (guildId: string) =>
        apiRequest(`/userdata/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchEventData: (guildId: string) =>
        apiRequest(`/eventdata/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchEventUserData: (guildId: string, eventId: string) =>
        apiRequest(`/eventuserdata/${guildId}/${eventId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    fetchPresets: (guildId: string) =>
        apiRequest(`/presets/${guildId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        })
}