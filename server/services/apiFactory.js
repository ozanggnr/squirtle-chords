const SongsterrProvider = require('./songsterr');

class MusicApiFactory {
    constructor() {
        this.providers = [SongsterrProvider];
    }

    /**
     * Search all enabled music providers
     * @param {string} query - Search term
     * @returns {Promise<Array>} Combined normalized results
     */
    async searchAll(query) {
        console.log(`[API Factory] Starting search across ${this.providers.length} provider(s)`);
        let results = [];

        for (const provider of this.providers) {
            try {
                const providerResults = await provider.search(query);

                if (Array.isArray(providerResults) && providerResults.length > 0) {
                    console.log(`[API Factory] Provider returned ${providerResults.length} results`);
                    results = [...results, ...providerResults];
                } else {
                    console.log(`[API Factory] Provider returned no results`);
                }
            } catch (providerError) {
                console.error(`[API Factory] Provider error:`, providerError.message);
                // Continue with other providers
            }
        }

        console.log(`[API Factory] Total external results: ${results.length}`);
        return results;
    }
}

module.exports = new MusicApiFactory();
