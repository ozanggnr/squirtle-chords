const SongsterrProvider = require('./songsterr');

class MusicApiFactory {
    constructor() {
        this.providers = [SongsterrProvider];
    }

    async searchAll(query) {
        let results = [];

        // We can add more providers here and Promise.all them
        // For now, just Songsterr
        for (const provider of this.providers) {
            const providerResults = await provider.search(query);
            results = [...results, ...providerResults];
        }

        return results;
    }
}

module.exports = new MusicApiFactory();
