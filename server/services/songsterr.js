const axios = require('axios');

class SongsterrProvider {
    constructor() {
        this.baseUrl = 'https://www.songsterr.com/a/ra/songs.json';
        this.sourceName = 'songsterr';
        this.timeout = 10000; // 10 second timeout
    }

    /**
     * Search Songsterr API for songs
     * @param {string} query - Search term
     * @returns {Promise<Array>} Normalized song objects
     */
    async search(query) {
        const startTime = Date.now();

        try {
            if (!query || query.trim().length === 0) {
                console.log('[Songsterr] Empty query provided, skipping API call');
                return [];
            }

            console.log(`[Songsterr] Starting search for: "${query}"`);

            // Make API call
            const response = await axios.get(this.baseUrl, {
                params: { pattern: query },
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'Squirtle-Chords/1.0'
                }
            });

            const duration = Date.now() - startTime;
            console.log(`[Songsterr] API call completed in ${duration}ms`);

            // Validate response
            if (!response || !response.data) {
                console.warn('[Songsterr] API returned null/undefined response');
                return [];
            }

            if (!Array.isArray(response.data)) {
                console.error('[Songsterr] API response is not an array:', typeof response.data);
                return [];
            }

            if (response.data.length === 0) {
                console.log(`[Songsterr] No results found for: "${query}"`);
                return [];
            }

            console.log(`[Songsterr] Raw API returned ${response.data.length} results`);

            // Normalize and validate each song
            const normalizedSongs = [];
            for (const [index, song] of response.data.entries()) {
                try {
                    const normalized = this.normalizeSong(song);
                    if (normalized) {
                        normalizedSongs.push(normalized);
                    } else {
                        console.warn(`[Songsterr] Skipped invalid song at index ${index}`);
                    }
                } catch (normError) {
                    console.error(`[Songsterr] Error normalizing song at index ${index}:`, normError.message);
                }
            }

            console.log(`[Songsterr] Successfully normalized ${normalizedSongs.length}/${response.data.length} songs`);

            // Limit to 10 results for performance
            const limited = normalizedSongs.slice(0, 10);
            console.log(`[Songsterr] Returning ${limited.length} results (limit: 10)`);

            return limited;

        } catch (error) {
            const duration = Date.now() - startTime;

            if (error.code === 'ECONNABORTED') {
                console.error(`[Songsterr] Request timeout after ${duration}ms`);
            } else if (error.response) {
                // Server responded with error status
                console.error(`[Songsterr] API error (status ${error.response.status}):`, error.response.data);
            } else if (error.request) {
                // Request made but no response
                console.error('[Songsterr] No response received from API');
            } else {
                // Other error
                console.error('[Songsterr] Search error:', error.message);
            }

            return []; // Graceful fallback
        }
    }

    /**
     * Normalize Songsterr response to our Song model
     * @param {Object} song - Raw Songsterr song object
     * @returns {Object|null} Normalized song or null if invalid
     */
    normalizeSong(song) {
        // Validate required fields
        if (!song || typeof song !== 'object') {
            console.warn('[Songsterr] Invalid song object:', song);
            return null;
        }

        if (!song.id) {
            console.warn('[Songsterr] Song missing ID, skipping');
            return null;
        }

        if (!song.title || typeof song.title !== 'string') {
            console.warn(`[Songsterr] Song ${song.id} missing valid title`);
            return null;
        }

        if (!song.artist || !song.artist.name) {
            console.warn(`[Songsterr] Song ${song.id} missing valid artist`);
            return null;
        }

        // Normalize data
        return {
            title: song.title.trim(),
            artist: song.artist.name.trim(),
            language: 'English', // Songsterr is primarily English
            type: Array.isArray(song.tabTypes) && song.tabTypes.includes('CHORDS') ? 'Chords' : 'Tabs',
            source: this.sourceName,
            externalId: String(song.id), // Ensure it's a string
            tabTypes: Array.isArray(song.tabTypes) ? song.tabTypes : [],
            content: '' // Content requires separate fetch
        };
    }
}

module.exports = new SongsterrProvider();
