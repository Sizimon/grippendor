'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, config } from '@/types/types';
import { authAPI } from '@/features/auth/api/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [guild, setGuild] = useState<config | null>(null);

    console.log(guild)

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const data = await authAPI.me();
                if (data && data.guildId) {
                    setIsAuthenticated(true);
                    setGuild({
                        id: data.guildId,
                    });
                } else {
                    setIsAuthenticated(false);
                    setGuild(null);
                }
            } catch (error) {
                setIsAuthenticated(false);
                setGuild(null);
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (guildId: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            await authAPI.login(guildId, password);
            const data = await authAPI.me();
            if (!data) {
                throw new Error('No user data returned from API');
            }
            setGuild({
                id: data.guildId,
            });
            console.log('Guild data:', {
                guildId: data.guildId,
            });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: (error instanceof Error ? error.message : 'Login failed') };
        }
    };

    const logout = async () => {
        await authAPI.logout();
        setGuild(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            isLoading,
            guild,
            setGuild,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};