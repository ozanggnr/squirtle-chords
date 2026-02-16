const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a song title'],
        trim: true
    },
    artist: {
        type: String,
        required: [true, 'Please add an artist name'],
        trim: true
    },
    language: {
        type: String,
        enum: ['Turkish', 'English'],
        default: 'Turkish'
    },
    type: {
        type: String,
        enum: ['Chords', 'Tabs'],
        default: 'Chords'
    },
    content: {
        type: String,
        required: [false, 'Content not required for external songs']
    },
    source: {
        type: String,
        enum: ['local', 'songsterr', 'lyricsovh'],
        default: 'local'
    },
    externalId: {
        type: String
    },
    tabTypes: {
        type: [String] // e.g. ["PLAYER", "TEXT_GUITAR_TAB", "CHORDS"]
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: function () { return this.source === 'local'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for search
SongSchema.index({ title: 'text', artist: 'text' });
SongSchema.index({ externalId: 1 }); // Index for fast external lookup

module.exports = mongoose.model('Song', SongSchema);
