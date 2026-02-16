const mongoose = require('mongoose');
const axios = require('axios');
const Song = require('./models/Song');
require('dotenv').config();

/**
 * Database Seeder - Populates DB with sample songs
 * Run: node server/seed.js
 */

const sampleSongs = [
    {
        title: "Wonderwall",
        artist: "Oasis",
        language: "English",
        type: "Chords",
        content: `[Intro]
Em7  G  Dsus4  A7sus4

[Verse 1]
Em7              G
Today is gonna be the day
         Dsus4                    A7sus4
That they're gonna throw it back to you
Em7               G
By now you should've somehow
    Dsus4                 A7sus4
Realized what you gotta do

[Chorus]
         C           D           Em7
And maybe you're gonna be the one that saves me
    C    D    Em7
And after all
         C    D    Em7
You're my wonderwall`,
        source: "local"
    },
    {
        title: "Nothing Else Matters",
        artist: "Metallica",
        language: "English",
        type: "Chords",
        content: `[Intro]
Em  D  C

[Verse 1]
Em
So close, no matter how far
      D                    C
Couldn't be much more from the heart
Em
Forever trusting who we are
    G         B7        Em
And nothing else matters

[Chorus]
C                D
Never opened myself this way
Em
Life is ours, we live it our way
C                        D
All these words I don't just say
    Em
And nothing else matters`,
        source: "local"
    },
    {
        title: "Duman - Senden Daha Güzel",
        artist: "Duman",
        language: "Turkish",
        type: "Chords",
        content: `[Intro]
Am  F  C  G

[Nakarat]
Am              F
Senden daha güzel
     C              G
Bir şey yok bu gece
Am              F
Senden daha güzel
     C              G
Bir şey yok

[Verse]
Am                    F
Yüzünde bir tebessüm hiç solmasın
C                   G
Bende bi' ömür boyu kalma`,
        source: "local"
    },
    {
        title: "Hotel California",
        artist: "Eagles",
        language: "English",
        type: "Chords",
        content: `[Intro]
Bm  F#  A  E  G  D  Em  F#

[Verse 1]
Bm                        F#
On a dark desert highway, cool wind in my hair
A                      E
Warm smell of colitas rising up through the air
G                       D
Up ahead in the distance I saw a shimmering light
Em
My head grew heavy and my sight grew dim
F#
I had to stop for the night

[Chorus]
G                           D
Welcome to the Hotel California
F#                                    Bm
Such a lovely place (such a lovely place)`,
        source: "local"
    },
    {
        title: "Mor ve Ötesi - Deli",
        artist: "Mor ve Ötesi",
        language: "Turkish",
        type: "Chords",
        content: `[Intro]
Am  C  G  F

[Nakarat]
Am           C
Deli deli deli
     G           F
Deliyim ben sana
Am           C
Deli deli deli
     G           F
Deliyim ben sana`,
        source: "local"
    },
    {
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        language: "English",
        type: "Chords",
        content: `[Intro]
Am  E+  C  D  F  G  Am

[Verse 1]
Am           E+           C         D
There's a lady who's sure all that glitters is gold
        F              G        Am
And she's buying a stairway to heaven
Am              E+        C           D
When she gets there she knows if the stores are all closed
       F                G           Am
With a word she can get what she came for`,
        source: "local"
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing local songs
        const deleteResult = await Song.deleteMany({ source: 'local' });
        console.log(`🗑️  Removed ${deleteResult.deletedCount} existing local songs\n`);

        // Insert sample songs
        let successCount = 0;
        let errorCount = 0;

        for (const songData of sampleSongs) {
            try {
                const song = await Song.create(songData);
                console.log(`✅ Added: ${song.title} - ${song.artist} (${song.language})`);
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to add ${songData.title}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successfully added: ${successCount}`);
        console.log(`   ❌ Failed: ${errorCount}`);
        console.log(`\n🎉 Database seeding complete!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
