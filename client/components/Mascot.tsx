'use client';

import { useEffect, useState } from 'react';

interface MascotProps {
    size?: number;
    showAnimation?: boolean;
    className?: string;
}

export default function Mascot({ size = 80, showAnimation = false, className = '' }: MascotProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`inline-block ${showAnimation ? 'animate-bounce-slow' : ''} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: size, height: size }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                width={size}
                height={size}
                className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            >
                <defs>
                    <linearGradient id="shellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#67e8f9', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation={isHovered ? "4" : "2"} result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Shell */}
                <ellipse cx="100" cy="80" rx="50" ry="45" fill="url(#shellGradient)" />
                <circle cx="85" cy="70" r="8" fill="#1e40af" opacity="0.6" />
                <circle cx="115" cy="70" r="8" fill="#1e40af" opacity="0.6" />
                <circle cx="100" cy="90" r="10" fill="#1e40af" opacity="0.6" />

                {/* Head */}
                <circle cx="100" cy="120" r="35" fill="url(#bodyGradient)" filter="url(#glow)" />

                {/* Eyes */}
                <circle cx="90" cy="115" r="5" fill="#1e3a8a" />
                <circle cx="110" cy="115" r="5" fill="#1e3a8a" />
                <circle cx="92" cy="113" r="2" fill="#fff" />
                <circle cx="112" cy="113" r="2" fill="#fff" />

                {/* Smile */}
                <path d="M 85 125 Q 100 132 115 125" stroke="#1e3a8a" strokeWidth="2" fill="none" strokeLinecap="round" />

                {/* Arms */}
                <ellipse cx="65" cy="125" rx="12" ry="18" fill="url(#bodyGradient)" />
                <ellipse cx="135" cy="125" rx="12" ry="18" fill="url(#bodyGradient)" />

                {/* Legs */}
                <ellipse cx="80" cy="155" rx="15" ry="10" fill="url(#bodyGradient)" />
                <ellipse cx="120" cy="155" rx="15" ry="10" fill="url(#bodyGradient)" />

                {/* Guitar Pick */}
                <g transform="translate(145, 120)">
                    <path d="M 0 0 L -8 10 L 0 18 L 8 10 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                    <circle cx="0" cy="9" r="2" fill="#f59e0b" />
                </g>
            </svg>
        </div>
    );
}
