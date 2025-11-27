import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = false,
    className = '',
    ...props
}) => {
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <div className={`${widthClass}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`input ${widthClass} ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};
