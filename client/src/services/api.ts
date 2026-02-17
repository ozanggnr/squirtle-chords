/**
 * API Service
 * Centralized Axios client for all backend communication
 */

import axios from 'axios';
import type { Song, PaginatedResponse, ManualSongData } from '../types';

const api = axios.create({
    baseURL: '/api', // Proxied through Vite to http://localhost:3000/api
    headers: {
        'Content-Type': 'application/json',
    },
});

export const songAPI = {
    /**
     * Get all songs with pagination
     */
    getAllSongs: async (page = 1, limit = 20): Promise<PaginatedResponse<Song>> => {
        const response = await api.get('/songs', {
            params: { page, limit },
        });
        return response.data;
    },

    /**
     * Get single song by ID
     */
    getSongById: async (id: string): Promise<Song> => {
        const response = await api.get(`/songs/${id}`);
        return response.data.song; // Unwrap from {success: true, song: {...}}
    },

    /**
     * Upload PDF or Word file
     */
    uploadFile: async (title: string, artist: string, file: File): Promise<Song> => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('file', file);

        const response = await api.post('/songs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Create song manually
     */
    createManualSong: async (data: ManualSongData): Promise<Song> => {
        const response = await api.post('/songs/manual', data);
        return response.data;
    },

    /**
     * Search songs
     */
    searchSongs: async (query: string): Promise<Song[]> => {
        const response = await api.get('/songs/search', {
            params: { q: query },
        });
        return response.data.songs;
    },

    /**
     * Delete song
     */
    deleteSong: async (id: string): Promise<void> => {
        await api.delete(`/songs/${id}`);
    },
};

export default api;
