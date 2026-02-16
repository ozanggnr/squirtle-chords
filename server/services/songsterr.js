const axios = require('axios');

class SongsterrProvider {
    constructor() {
        this.baseUrl = 'https://www.songsterr.com/a/ra/songs.json';
        this.sourceName = 'songsterr';
    }

    // Songsterr API search
    // Using Pattern search: https://www.songsterr.com/a/ra/songs.json?pattern=Marley
    async search(query) {
        try {
            if (!query) return [];

            const response = await axios.get(this.baseUrl, {
                params: { pattern: query }
            });

            if (!response.data || !Array.isArray(response.data)) {
                return [];
            }

            // Normalize data
            return response.data.map(song => ({
                title: song.title,
                artist: song.artist.name, // Songsterr structure: artist: { name: "..." }
                // Songsterr doesn't give content or language directly in search list easily
                // We'll guess or default.
                // It provides tabTypes ["PLAYER", "TEXT_GUITAR_TAB", "CHORDS"]
                language: 'English', // Defaulting for now, hard to detect
                type: song.tabTypes.includes('CHORDS') ? 'Chords' : 'Tabs',
                source: this.sourceName,
                externalId: song.id.toString(),
                tabTypes: song.tabTypes,
                content: '' // Content is fetched separately or we link to it
            })).slice(0, 10); // Limit to 10 for performance

        } catch (error) {
            console.error('Songsterr API Error:', error.message);
            return [];
        }
    }
}

module.exports = new SongsterrProvider();
