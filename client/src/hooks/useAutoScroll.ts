/**
 * Auto-Scroll Hook
 * Smooth auto-scrolling with adjustable speed
 */

import { useState, useEffect, useRef } from 'react';

interface UseAutoScrollReturn {
    isScrolling: boolean;
    speed: number;
    startScroll: () => void;
    stopScroll: () => void;
    toggleScroll: () => void;
    setSpeed: (speed: number) => void;
}

export function useAutoScroll(): UseAutoScrollReturn {
    const [isScrolling, setIsScrolling] = useState(false);
    const [speed, setSpeed] = useState(2); // 1-5 range
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScroll = () => {
        setIsScrolling(true);
    };

    const stopScroll = () => {
        setIsScrolling(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const toggleScroll = () => {
        if (isScrolling) {
            stopScroll();
        } else {
            startScroll();
        }
    };

    useEffect(() => {
        if (isScrolling) {
            // Calculate scroll amount based on speed
            // speed 1 = 1px per 50ms, speed 5 = 5px per 50ms
            const scrollAmount = speed;
            const interval = 50; // ms

            intervalRef.current = setInterval(() => {
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'auto', // Use 'auto' for smoother continuous scrolling
                });

                // Stop at bottom
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                    stopScroll();
                }
            }, interval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isScrolling, speed]);

    return {
        isScrolling,
        speed,
        startScroll,
        stopScroll,
        toggleScroll,
        setSpeed,
    };
}
