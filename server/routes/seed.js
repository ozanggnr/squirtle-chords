const express = require('express');
const router = express.Router();

// POST /api/seed - Seed the database with sample data  
// No auth required for initial setup
router.post('/', async (req, res) => {
    try {
        console.log('[SEED API] Starting database seeding...');

        // Import required dependencies
        const Song = require('../models/Song');

        const sampleSongs = [
            {
                title: "Wonderwall",
                artist: "Oasis",
                language: "English",
                type: "Chords",
                content: `[Intro]\nEm7  G  Dsus4  A7sus4\n\n[Verse 1]\nEm7              G\nToday is gonna be the day\n         Dsus4                    A7sus4\nThat they're gonna throw it back to you\nEm7               G\nBy now you should've somehow\n    Dsus4                 A7sus4\nRealized what you gotta do\n\n[Chorus]\n         C           D           Em7\nAnd maybe you're gonna be the one that saves me\n    C    D    Em7\nAnd after all\n         C    D    Em7\nYou're my wonderwall`,
                source: "local"
            },
            {
                title: "Hotel California",
                artist: "Eagles",
                language: "English",
                type: "Chords",
                content: `[Intro]\nBm  F#  A  E  G  D  Em  F#\n\n[Verse 1]\nBm                        F#\nOn a dark desert highway, cool wind in my hair\nA                      E\nWarm smell of colitas rising up through the air\nG                       D\nUp ahead in the distance I saw a shimmering light\nEm\nMy head grew heavy and my sight grew dim\nF#\nI had to stop for the night`,
                source: "local"
            },
            {
                title: "Nothing Else Matters",
                artist: "Metallica",
                language: "English",
                type: "Chords",
                content: `[Intro]\nEm  D  C\n\n[Verse 1]\nEm\nSo close, no matter how far\n      D                    C\nCouldn't be much more from the heart\nEm\nForever trusting who we are\n    G         B7        Em\nAnd nothing else matters`,
                source: "local"
            },
            {
                title: "Stairway to Heaven",
                artist: "Led Zeppelin",
                language: "English",
                type: "Chords",
                content: `[Intro]\nAm  E+  C  D  F  G  Am\n\n[Verse 1]\nAm           E+           C         D\nThere's a lady who's sure all that glitters is gold\n        F              G        Am\nAnd she's buying a stairway to heaven`,
                source: "local"
            },
            {
                title: "Senden Daha Güzel",
                artist: "Duman",
                language: "Turkish",
                type: "Chords",
                content: `[Intro]\nAm  F  C  G\n\n[Nakarat]\nAm              F\nSenden daha güzel\n     C              G\nBir şey yok bu gece\nAm              F\nSenden daha güzel\n     C              G\nBir şey yok`,
                source: "local"
            },
            {
                title: "Deli",
                artist: "Mor ve Ötesi",
                language: "Turkish",
                type: "Chords",
                content: `[Intro]\nAm  C  G  F\n\n[Nakarat]\nAm           C\nDeli deli deli\n     G           F\nDeliyim ben sana`,
                source: "local"
            }
        ];

        // Clear existing local songs
        const deleteResult = await Song.deleteMany({ source: 'local' });
        console.log(`[SEED API] Removed ${deleteResult.deletedCount} existing local songs`);

        // Insert sample songs
        let successCount = 0;
        let errorCount = 0;

        for (const songData of sampleSongs) {
            try {
                await Song.create(songData);
                console.log(`[SEED API] Added: ${songData.title} - ${songData.artist}`);
                successCount++;
            } catch (error) {
                console.error(`[SEED API] Failed to add ${songData.title}:`, error.message);
                errorCount++;
            }
        }

        console.log(`[SEED API] Complete! Success: ${successCount}, Errors: ${errorCount}`);

        res.json({
            success: true,
            message: 'Database seeded successfully',
            stats: {
                removed: deleteResult.deletedCount,
                added: successCount,
                errors: errorCount
            }
        });
    } catch (error) {
        console.error('[SEED API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
