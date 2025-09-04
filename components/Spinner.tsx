
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };
    return (
        <div className="flex justify-center items-center">
            <div className={`${sizeClasses[size]} border-4 border-brand-border border-t-brand-primary rounded-full animate-spin`}></div>
        </div>
    );
};
