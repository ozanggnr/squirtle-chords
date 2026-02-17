/**
 * useFavorites Hook
 * Manages local favorites with localStorage
 */

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'chordflow_favorites';
const MAX_FAVORITES = 100;

interface Favorite {
    id: number;
    addedAt: number;
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                const parsed: Favorite[] = JSON.parse(stored);
                setFavorites(parsed.map(f => f.id));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    }, []);

    // Check if song is favorited
    const isFavorite = useCallback((songId: number): boolean => {
        return favorites.includes(songId);
    }, [favorites]);

    // Add to favorites
    const addFavorite = useCallback((songId: number) => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            let favList: Favorite[] = stored ? JSON.parse(stored) : [];

            // Check if already favorited
            if (favList.some(f => f.id === songId)) {
                return;
            }

            // Check max limit
            if (favList.length >= MAX_FAVORITES) {
                throw new Error(`Maximum ${MAX_FAVORITES} favorites allowed`);
            }

            // Add new favorite
            favList.push({
                id: songId,
                addedAt: Date.now(),
            });

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favList));
            setFavorites(prev => [...prev, songId]);
        } catch (error) {
            console.error('Failed to add favorite:', error);
            throw error;
        }
    }, []);

    // Remove from favorites
    const removeFavorite = useCallback((songId: number) => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (!stored) return;

            let favList: Favorite[] = JSON.parse(stored);
            favList = favList.filter(f => f.id !== songId);

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favList));
            setFavorites(prev => prev.filter(id => id !== songId));
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            throw error;
        }
    }, []);

    // Toggle favorite
    const toggleFavorite = useCallback((songId: number) => {
        if (isFavorite(songId)) {
            removeFavorite(songId);
        } else {
            addFavorite(songId);
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    // Get all favorites with metadata
    const getAllFavorites = useCallback((): Favorite[] => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to get favorites:', error);
            return [];
        }
    }, []);

    // Clear all favorites
    const clearFavorites = useCallback(() => {
        try {
            localStorage.removeItem(FAVORITES_KEY);
            setFavorites([]);
        } catch (error) {
            console.error('Failed to clear favorites:', error);
        }
    }, []);

    return {
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        getAllFavorites,
        clearFavorites,
        count: favorites.length,
    };
}
