const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/grippendor/api';

// API REQUEST WRAPPER
const apiRequest = async (endpoint: string, options: RequestInit & { skip401Redirect?: boolean } = {}) => {
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Always send cookies for authentication
        ...options,
    };

    try {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`, config);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error('API error response:', errorData);
                throw new Error(errorData.error || errorData.message || 'API request failed');
            } else {
                const text = await response.text();
                console.error('Non-JSON error response:', text);
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};


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