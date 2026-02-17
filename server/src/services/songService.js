/**
 * Enhanced Song Service
 * API integration with caching and rate limiting
 */

const axios = require('axios');

class SongService {
    constructor() {
        this.cache = new Map();
        this.lastRequestTime = 0;
        this.MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
    }

    /**
     * Rate limiting helper
     */
    async rateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
            const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        this.lastRequestTime = Date.now();
    }

    /**
     * Check cache for existing data
     */
    getCached(key) {
        const cached = this.cache.get(key);

        if (!cached) return null;

        // Cache expires after 7 days
        const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
        const age = Date.now() - cached.timestamp;

        if (age > MAX_AGE) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    /**
     * Store in cache
     */
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    /**
     * Search for chords/tabs by title and artist
     * Note: This is a placeholder - real implementation would use actual API
     */
    async searchSong(title, artist) {
        try {
            // Check cache first
            const cacheKey = `${title}-${artist}`.toLowerCase();
            const cached = this.getCached(cacheKey);

            if (cached) {
                return cached;
            }

            // Rate limiting
            await this.rateLimit();

            // Placeholder: In production, integrate with real API
            // Example: Ultimate Guitar, ChordPro, etc.

            // For now, return a helpful error
            throw new Error(
                'External API integration not configured. ' +
                'Please use manual entry or file upload instead.'
            );

            // Example real implementation:
            /*
            const response = await axios.get('https://api.chords.com/search', {
              params: { title, artist },
              timeout: 5000,
            });
            
            const data = this.normalizeAPIResponse(response.data);
            this.setCache(cacheKey, data);
            
            return data;
            */
        } catch (error) {
            console.error('API search error:', error);

            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a minute.');
            }

            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout. Please check your connection.');
            }

            throw new Error(error.message || 'Failed to fetch from external API');
        }
    }

    /**
     * Normalize API response to our format
     */
    normalizeAPIResponse(apiData) {
        // This would transform external API data to our Song model
        return {
            title: apiData.title || 'Unknown',
            artist: apiData.artist || 'Unknown',
            content: apiData.content || apiData.chords || '',
            source: 'api',
            externalId: apiData.id?.toString() || null,
        };
    }

    /**
     * Fetch specific song by external ID
     */
    async fetchByExternalId(externalId) {
        try {
            const cached = this.getCached(`id-${externalId}`);
            if (cached) return cached;

            await this.rateLimit();

            throw new Error('External API integration not configured.');

            // Real implementation example:
            /*
            const response = await axios.get(`https://api.chords.com/songs/${externalId}`, {
              timeout: 5000,
            });
            
            const data = this.normalizeAPIResponse(response.data);
            this.setCache(`id-${externalId}`, data);
            
            return data;
            */
        } catch (error) {
            console.error('API fetch error:', error);
            throw new Error(error.message || 'Failed to fetch song from API');
        }
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache() {
        this.cache.clear();
    }
}

// Export singleton instance
module.exports = new SongService();
