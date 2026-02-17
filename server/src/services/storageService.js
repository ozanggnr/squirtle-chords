/**
 * In-Memory Storage Service
 * Simple storage without database dependencies
 */

class StorageService {
    constructor() {
        this.songs = [];
        this.nextId = 1;

        // Add some sample songs
        this.seedData();
    }

    seedData() {
        const sampleSongs = [
            {
                id: this.nextId++,
                title: 'Wonderwall',
                artist: 'Oasis',
                content: `[Intro]
Em7  G  Dsus4  A7sus4

[Verse 1]
Em7           G
Today is gonna be the day
         Dsus4                A7sus4
That they're gonna throw it back to you
Em7              G
By now you should've somehow
    Dsus4              A7sus4
Realized what you gotta do`,
                source: 'manual',
                fileType: null,
                createdAt: new Date().toISOString(),
            },
            {
                id: this.nextId++,
                title: 'Let It Be',
                artist: 'The Beatles',
                content: `[Verse 1]
C               G
When I find myself in times of trouble
Am              F
Mother Mary comes to me
C                G              F  C
Speaking words of wisdom, let it be`,
                source: 'manual',
                fileType: null,
                createdAt: new Date().toISOString(),
            },
        ];

        this.songs = sampleSongs;
    }

    getAllSongs({ page = 1, limit = 20 }) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedSongs = this.songs.slice(startIndex, endIndex);

        return {
            songs: paginatedSongs,
            total: this.songs.length,
            page,
            limit,
            totalPages: Math.ceil(this.songs.length / limit),
        };
    }

    getSongById(id) {
        return this.songs.find(song => song.id === parseInt(id)) || null;
    }

    createSong(songData) {
        const song = {
            id: this.nextId++,
            title: songData.title,
            artist: songData.artist,
            content: songData.content,
            source: songData.source || 'manual',
            fileType: songData.fileType || null,
            createdAt: new Date().toISOString(),
        };

        this.songs.unshift(song); // Add to beginning
        return song;
    }

    searchSongs(query) {
        const lowerQuery = query.toLowerCase();
        return this.songs.filter(song =>
            song.title.toLowerCase().includes(lowerQuery) ||
            song.artist.toLowerCase().includes(lowerQuery)
        );
    }

    deleteSong(id) {
        const index = this.songs.findIndex(song => song.id === parseInt(id));
        if (index === -1) {
            throw new Error('Song not found');
        }
        this.songs.splice(index, 1);
    }
}

module.exports = new StorageService();
