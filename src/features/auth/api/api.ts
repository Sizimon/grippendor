import { apiRequest } from '@/lib/api';

// AUTH API ENDPOINTS
export const authAPI = {
    login: (guildId: string, password: string, skip401Redirect: boolean = true) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ guildId, password }),
            skip401Redirect,
        }),
    me: () =>
        apiRequest('/auth/me', {
            method: 'GET',
            credentials: 'include', // Include cookies for session management
        }),
    logout: () =>
        apiRequest('/auth/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies for session management
        })
};