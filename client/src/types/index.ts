/**
 * TypeScript Type Definitions
 *  Core data models for the frontend
 */

export interface Song {
    id: string;
    title: string;
    artist: string;
    content: string;
    source: 'api' | 'upload' | 'manual';
    fileType?: 'pdf' | 'docx' | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    songs: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ErrorResponse {
    error: string;
}

export interface UploadFormData {
    title: string;
    artist: string;
    file: File;
}

export interface ManualSongData {
    title: string;
    artist: string;
    content: string;
}
