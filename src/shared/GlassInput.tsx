import React from 'react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    className?: string;
}

const GlassInput: React.FC<GlassInputProps> = ({ 
    value, 
    onChange, 
    className ,
    type = 'text',
    placeholder = '',
    ...props

}) => {
    return (
        <input 
            type={type}
            placeholder={placeholder}
            value={value} 
            onChange={onChange}
            className={cn(
                "bg-white/10 rounded-lg px-2 py-1 border border-white/20 focus:border-white/40 focus:outline-none transition-colors",
                className
            )}
            {...props} 
        />
    )
}

export default GlassInput;