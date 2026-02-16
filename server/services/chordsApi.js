const axios = require('axios');

/**
 * Free Chords API Provider
 * Source: https://alday.dev/chords-api
 * No authentication required
 */
class ChordsApiProvider {
    constructor() {
        this.baseUrl = 'https://api.alday.dev/chords';
        this.sourceName = 'chords-api';
    }

    /**
     * Search for chord information
     * Note: This API provides chord data (fingerings, notes) but not full songs
     * We'll use it to enrich our chord database
     */
    async search(query) {
        try {
            console.log(`[ChordsAPI] Searching for: "${query}"`);

            // This API doesn't have a search endpoint - it provides chord data by chord name
            // For now, we'll return empty and focus on other APIs
            // This can be used to get chord diagrams/fingerings when displaying songs

            console.log('[ChordsAPI] Skipping - this API is for chord diagrams, not song search');
            return [];

        } catch (error) {
            console.error('[ChordsAPI] Error:', error.message);
            return [];
        }
    }

    /**
     * Get specific chord data (for future use when displaying songs)
     * @param {string} chordName - e.g., "C", "Dm", "G7"
     */
    async getChord(chordName) {
        try {
            const response = await axios.get(`${this.baseUrl}/${chordName.toUpperCase()}`);
            return response.data;
        } catch (error) {
            console.error(`[ChordsAPI] Error fetching chord ${chordName}:`, error.message);
            return null;
        }
    }
}

module.exports = new ChordsApiProvider();
