/**
 * Seed Database with Sample Songs
 * Run this script to add sample guitar chords to the database
 */

import { StorageService } from './src/services/storageService.js';
import { initializeDatabase } from './src/config/database.js';

// Initialize database
initializeDatabase();

const sampleSongs = [
    {
        title: 'Hey There Delilah',
        artist: 'Plain White T\'s',
        source: 'manual',
        content: `[Verse 1]
    C              G
Hey there, Delilah
        Am
What's it like in New York City?
               C                    G
I'm a thousand miles away
                Am                       F
But, girl, tonight you look so pretty
      G        Am
Yes you do

[Chorus]
            G              Am
Times Square can't shine as bright as you
      G
I swear, it's true`,
    },
    {
        title: 'Wonderwall',
        artist: 'Oasis',
        source: 'manual',
        content: `[Intro]
Em7  G  Dsus4  A7sus4

[Verse 1]
Em7                G
Today is gonna be the day
           Dsus4                    A7sus4
That they're gonna throw it back to you
Em7                 G
By now you should've somehow
         Dsus4                  A7sus4
Realized what you gotta do

[Chorus]
         Cadd9   Dsus4           Em7
And all the roads we have to walk are winding
         Cadd9   Dsus4           Em7
And all the lights that lead us there are blinding`,
    },
    {
        title: 'Hotel California',
        artist: 'Eagles',
        source: 'manual',
        content: `[Intro]
Bm - F# - A - E - G - D - Em - F#

[Verse 1]
Bm                           F#
On a dark desert highway, cool wind in my hair
A                        E
Warm smell of colitas rising up through the air
G                            D
Up ahead in the distance, I saw a shimmering light
Em
My head grew heavy and my sight grew dim
F#
I had to stop for the night`,
    },
];

console.log('🌱 Seeding database with sample songs...\n');

for (const song of sampleSongs) {
    try {
        const created = StorageService.createSong(song);
        console.log(`✅ Created: "${created.title}" by ${created.artist}`);
    } catch (error) {
        console.error(`❌ Error creating "${song.title}":`, error.message);
    }
}

console.log('\n✨ Database seeding complete!');
