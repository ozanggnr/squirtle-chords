const Song = require('../models/Song');
const apiFactory = require('../services/apiFactory');

// @desc    Create a new song
// @route   POST /api/songs
// @access  Private
const createSong = async (req, res) => {
    try {
        const { title, artist, language, type, content } = req.body;

        const song = await Song.create({
            title,
            artist,
            language,
            type,
            content,
            source: 'local',
            createdBy: req.user.id
        });

        res.status(201).json(song);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all songs (with search and filter)
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
    try {
        const { search, language } = req.query;
        let query = {};

        // Search by title or artist
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by language
        if (language) {
            query.language = language;
        }

        // 1. Search Local DB first
        let songs = await Song.find(query).sort({ createdAt: -1 });

        // 2. If search query exists and local results are few (< 5), try external API
        if (search && songs.length < 5) {
            console.log(`Low local results for "${search}". Searching external APIs...`);
            try {
                const externalSongs = await apiFactory.searchAll(search);

                // 3. Process external results
                // We don't want to save duplicates if they already exist by externalId
                const newSongs = [];

                for (const extSong of externalSongs) {
                    // Check if exists by externalId
                    const existing = await Song.findOne({ externalId: extSong.externalId });

                    if (!existing) {
                        // Create new song record from external data
                        // Note: External songs might not have 'content' yet.
                        // We set createdBy to null or a system user if needed, but schema allows null for external
                        // Actually schema requires createdBy if source is local.

                        // We need to be careful about saving them immediately vs returning them as "external" results
                        // Strategy: Return them as mixed list. Only save if user "clicks" or we want to cache.
                        // REQUIREMENT: "Store fetched songs in local database"

                        const newSong = await Song.create({
                            ...extSong,
                            language: 'English', // Default or detected
                            source: 'songsterr',
                            // createdBy is not required for source != local
                        });
                        newSongs.push(newSong);
                    } else {
                        // If it exists but wasn't in our initial text search (maybe fuzzy match diff), add it
                        // But usually it would be found by text search if indexed.
                        // Let's just add it to our return list if not present
                        const alreadyInList = songs.find(s => s._id.toString() === existing._id.toString());
                        if (!alreadyInList) {
                            songs.push(existing);
                        }
                    }
                }

                // Append new valid songs to results
                songs = [...songs, ...newSongs];

            } catch (apiError) {
                console.error('External API Search Failed:', apiError.message);
                // Continue with local results only
            }
        }

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
const getSong = async (req, res) => {
    try {
        let song = await Song.findById(req.params.id).populate('createdBy', 'username');

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // If song has no content (external), try to fetch it now?
        // Phase 2 req: "Tabs (if available)"
        // Songsterr API doesn't give full tab text content easily via simple JSON on the search endpoint.
        // It's often HTML scraping or specific ID endpoints.
        // For Phase 1/2, if content is empty and it's external, we might show a link or try to fetch.

        // For now, let's return what we have. API integration usually gets metadata.

        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSong,
    getSongs,
    getSong
};
