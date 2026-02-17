/**
 * Enhanced Song Controller
 * Handles HTTP requests with validation and error handling
 */

const StorageService = require('../services/storageService');
const FileParserService = require('../services/fileParserService');
const songService = require('../services/songService');
const TextUtils = require('../utils/textUtils');

class SongController {
    /**
     * GET /api/songs - List all songs with pagination
     */
    static async getAllSongs(req, res) {
        try {
            const page = req.pagination?.page || parseInt(req.query.page) || 1;
            const limit = req.pagination?.limit || parseInt(req.query.limit) || 20;

            const result = StorageService.getAllSongs({ page, limit });

            res.json({
                success: true,
                ...result,
            });
        } catch (error) {
            console.error('Error fetching songs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch songs'
            });
        }
    }

    /**
     * GET /api/songs/:id - Get single song by ID
     */
    static async getSongById(req, res) {
        try {
            const song = StorageService.getSongById(req.params.id);

            if (!song) {
                return res.status(404).json({
                    success: false,
                    error: 'Song not found'
                });
            }

            res.json({
                success: true,
                song,
            });
        } catch (error) {
            console.error('Error fetching song:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch song'
            });
        }
    }

    /**
     * POST /api/songs/upload - Upload PDF or Word file
     */
    static async uploadFile(req, res) {
        try {
            const { title, artist } = req.body;
            const file = req.file;

            // Validate file (additional check beyond middleware)
            FileParserService.validateFile(file);

            // Parse the file with enhanced parsing
            const parseResult = await FileParserService.parseFile(file);

            // Apply chord highlighting
            const content = TextUtils.highlightChords(parseResult.content);

            // Save to database
            const song = StorageService.createSong({
                title: title.trim(),
                artist: artist.trim(),
                content,
                source: 'upload',
                fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'docx',
            });

            res.status(201).json({
                success: true,
                song,
                warning: parseResult.warning,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to upload file'
            });
        }
    }

    /**
     * POST /api/songs/manual - Create song manually
     */
    static async createManualSong(req, res) {
        try {
            const { title, artist, content } = req.body;

            // Clean and validate content
            const cleanedContent = TextUtils.cleanText(content);
            const validation = TextUtils.validateContent(cleanedContent);

            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: validation.reason
                });
            }

            // Apply chord highlighting
            const highlighted = TextUtils.highlightChords(cleanedContent);

            const song = StorageService.createSong({
                title: title.trim(),
                artist: artist.trim(),
                content: highlighted,
                source: 'manual',
            });

            res.status(201).json({
                success: true,
                song,
                warning: validation.warning,
            });
        } catch (error) {
            console.error('Error creating manual song:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to create song'
            });
        }
    }

    /**
     * GET /api/songs/search - Search songs
     */
    static async searchSongs(req, res) {
        try {
            const query = req.query.q;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    error: 'Search query is required'
                });
            }

            const songs = StorageService.searchSongs(query);

            res.json({
                success: true,
                songs,
                count: songs.length,
            });
        } catch (error) {
            console.error('Error searching songs:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to search songs'
            });
        }
    }

    /**
     * DELETE /api/songs/:id - Delete song
     */
    static async deleteSong(req, res) {
        try {
            StorageService.deleteSong(req.params.id);

            res.json({
                success: true,
                message: 'Song deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting song:', error);

            if (error.message === 'Song not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Song not found'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to delete song'
            });
        }
    }

    /**
     * POST /api/songs/fetch - Fetch from external API
     */
    static async fetchFromAPI(req, res) {
        try {
            const { title, artist } = req.body;

            if (!title || !artist) {
                return res.status(400).json({
                    success: false,
                    error: 'Title and artist are required'
                });
            }

            // Attempt to fetch from API
            const songData = await songService.searchSong(title, artist);

            // Clean and highlight content
            const cleanedContent = TextUtils.cleanText(songData.content);
            const highlighted = TextUtils.highlightChords(cleanedContent);

            const song = StorageService.createSong({
                title: songData.title,
                artist: songData.artist,
                content: highlighted,
                source: 'api',
                externalId: songData.externalId,
            });

            res.status(201).json({
                success: true,
                song,
            });
        } catch (error) {
            console.error('Error fetching from API:', error);
            res.status(503).json({
                success: false,
                error: error.message || 'External API unavailable'
            });
        }
    }
}

module.exports = SongController;
