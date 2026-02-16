const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Song = require('./models/Song');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await Song.deleteMany();

        const user = await User.create({
            username: 'squirtle_admin',
            email: 'admin@squirtle.com',
            password: 'password123'
        });

        console.log('User created:', user.username);

        const songs = [
            {
                title: 'Akdeniz Aksamları',
                artist: 'Haluk Levent',
                language: 'Turkish',
                type: 'Chords',
                content: `
Em                Am
Akdeniz akşamları bir başka oluyor
Em                Am
Hele bir de aylardan temmuz ise
Em                Am
Bir başka oluyor akdeniz akşamları

F       Em
Sımsıcak,
F         Em
Sımsıcak..
                `,
                createdBy: user._id
            },
            {
                title: 'Wonderwall',
                artist: 'Oasis',
                language: 'English',
                type: 'Chords',
                content: `
Em7       G
Today is gonna be the day
                Dsus4               A7sus4
That they're gonna throw it back to you
Em7             G
By now you should've somehow
        Dsus4            A7sus4
Realized what you gotta do
                `,
                createdBy: user._id
            },
            {
                title: 'Elfida',
                artist: 'Haluk Levent',
                language: 'Turkish',
                type: 'Chords',
                content: `
Bm                      Em
Yüzün geçmişten kalan
A                       Bm
Aşka tarif yazdıran
Bm                      Em
Bir alaturka hüzün
A                       Bm
Yüzün kıyıma vuran
                `,
                createdBy: user._id
            }
        ];

        await Song.insertMany(songs);
        console.log('Songs seeded!');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
