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
        const startTime = Date.now();

        console.log(`[GET /api/songs] Request params: search="${search}", language="${language}"`);

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
        console.log('[DB] Searching local database...');
        let songs = await Song.find(query).sort({ createdAt: -1 });
        console.log(`[DB] Found ${songs.length} local results`);

        // 2. If search query exists and local results are few (< 5), try external API
        if (search && songs.length < 5) {
            console.log(`[External API] Triggering external search (local results: ${songs.length})`);

            try {
                const externalSongs = await apiFactory.searchAll(search);
                console.log(`[External API] Received ${externalSongs.length} external results`);

                // 3. Process and save external results
                let savedCount = 0;
                let skippedCount = 0;
                let errorCount = 0;

                for (const extSong of externalSongs) {
                    try {
                        // Check if already exists by externalId
                        const existing = await Song.findOne({
                            externalId: extSong.externalId,
                            source: extSong.source
                        });

                        if (existing) {
                            console.log(`[DB] Song already exists: ${extSong.title} (externalId: ${extSong.externalId})`);
                            skippedCount++;

                            // Add to results if not already there
                            const inResults = songs.find(s => s._id.toString() === existing._id.toString());
                            if (!inResults) {
                                songs.push(existing);
                            }
                            continue;
                        }

                        // Validate before saving
                        if (!extSong.title || !extSong.artist) {
                            console.warn(`[DB] Skipping invalid song (missing title or artist)`);
                            skippedCount++;
                            continue;
                        }

                        // Save new external song
                        console.log(`[DB] Saving new external song: ${extSong.title} by ${extSong.artist}`);
                        const newSong = await Song.create({
                            ...extSong,
                            language: extSong.language || 'English',
                        });

                        console.log(`[DB] ✓ Saved successfully with ID: ${newSong._id}`);
                        songs.push(newSong);
                        savedCount++;

                    } catch (saveError) {
                        errorCount++;
                        console.error(`[DB] ✗ Failed to save song "${extSong.title}":`, saveError.message);

                        // Log validation errors specifically
                        if (saveError.name === 'ValidationError') {
                            console.error('[DB] Validation errors:', Object.keys(saveError.errors).map(key =>
                                `${key}: ${saveError.errors[key].message}`
                            ).join(', '));
                        }
                    }
                }

                console.log(`[External API] Summary: ${savedCount} saved, ${skippedCount} skipped (duplicates), ${errorCount} errors`);

            } catch (apiError) {
                console.error('[External API] Search failed:', apiError.message);
                console.error('[External API] Stack:', apiError.stack);
                // Continue with local results only
            }
        }

        const duration = Date.now() - startTime;
        console.log(`[GET /api/songs] Completed in ${duration}ms, returning ${songs.length} total results`);

        res.status(200).json(songs);
    } catch (error) {
        console.error('[GET /api/songs] Controller error:', error.message);
        console.error('[GET /api/songs] Stack:', error.stack);
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
