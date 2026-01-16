import React from 'react';

const CircularProgress = ({ 
    progress = 0, 
    size = 280, 
    strokeWidth = 12, 
    color = 'from-red-500 to-orange-500',
    children,
    isActive 
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-200 dark:text-slate-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-linear ${
                        isActive ? 'drop-shadow-lg' : ''
                    }`}
                    style={{ filter: isActive ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 'none' }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" className="text-red-500" />
                        <stop offset="100%" stopColor="currentColor" className="text-orange-500" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default CircularProgress;
