'use client';
import React, { useState, useRef, useEffect } from 'react';

export const RoleDropdown: React.FC<{
    currentRole: string;
    availableRoles: string[];
    onChange: (newRole: string) => void;
    className?: string;
}> = ({ currentRole, availableRoles, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'DPS': return 'bg-red-500/30 text-red-300 border-red-500/30';
            case 'HEALER': return 'bg-green-500/30 text-green-300 border-green-500/30';
            case 'TANK': return 'bg-blue-500/30 text-blue-300 border-blue-500/30';
            default: return 'bg-gray-500/30 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`text-xs px-2 py-1 rounded font-semibold border transition-all duration-200 hover:scale-105 ${getRoleColor(currentRole)}`}
            >
                {currentRole}
                <svg className="inline w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-[60] min-w-[100px]">
                    {availableRoles.map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(role);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left p-2 text-xs hover:bg-white/10 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${getRoleColor(role).replace('border-', '').replace('/30', '/20')}`}
                        >
                            {role}
                        </button>
                    ))}
                    {/* Add FLEX option if not in available roles */}
                    {!availableRoles.includes('FLEX') && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('FLEX');
                                setIsOpen(false);
                            }}
                            className="w-full text-left p-2 text-xs hover:bg-white/10 transition-colors duration-150 last:rounded-b-lg bg-gray-500/20 text-gray-300"
                        >
                            FLEX
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};