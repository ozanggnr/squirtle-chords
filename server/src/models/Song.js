/**
 * Song Model
 * Defines the Song entity structure and validation
 */

export class Song {
    constructor({ id, title, artist, content, source, fileType = null, createdAt, updatedAt }) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.content = content;
        this.source = source; // 'api', 'upload', or 'manual'
        this.fileType = fileType; // 'pdf', 'docx', or null
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    /**
     * Validate song data before persistence
     */
    validate() {
        if (!this.title || !this.artist || !this.content) {
            throw new Error('Title, artist, and content are required');
        }

        const validSources = ['api', 'upload', 'manual'];
        if (!validSources.includes(this.source)) {
            throw new Error(`Invalid source. Must be one of: ${validSources.join(', ')}`);
        }

        return true;
    }

    /**
     * Convert to plain object for JSON serialization
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            artist: this.artist,
            content: this.content,
            source: this.source,
            fileType: this.fileType,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
