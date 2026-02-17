/**
 * Chord Transposition Utilities
 * Transpose chords up/down by semitones
 */

// Note mappings for sharp notation
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Flat to sharp conversion
const FLAT_TO_SHARP: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
};

// Sharp to flat conversion (for display preferences)
const SHARP_TO_FLAT: Record<string, string> = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb',
};

/**
 * Transpose a single note by semitones
 */
export function transposeNote(note: string, semitones: number): string {
    // Normalize flats to sharps
    const normalizedNote = FLAT_TO_SHARP[note] || note;

    // Find current position
    const currentIndex = SHARP_NOTES.indexOf(normalizedNote);
    if (currentIndex === -1) return note; // Not a valid note

    // Calculate new position (handle wrap-around)
    const newIndex = (currentIndex + semitones + SHARP_NOTES.length * 10) % SHARP_NOTES.length;

    return SHARP_NOTES[newIndex];
}

/**
 * Transpose a full chord by semitones
 * Handles complex chords like Gmaj7, Dsus4, etc.
 */
export function transposeChord(chord: string, semitones: number): string {
    if (!chord || semitones === 0) return chord;

    // Match the root note (with optional flat/sharp)
    const match = chord.match(/^([A-G][b#]?)(.*)/);
    if (!match) return chord;

    const [, root, suffix] = match;
    const transposedRoot = transposeNote(root, semitones);

    return transposedRoot + suffix;
}

/**
 * Transpose all chords in a content string
 */
export function transposeContent(content: string, semitones: number): string {
    if (!content || semitones === 0) return content;

    // Chord pattern - matches most guitar chords
    const chordPattern = /\b([A-G][#b]?)(m|maj|min|dim|aug|sus)?([0-9]*)([b#][0-9]+)?(add[0-9]+|sus[24])?\b/g;

    return content.replace(chordPattern, (match) => {
        return transposeChord(match, semitones);
    });
}

/**
 * Calculate capo fret from transpose amount
 * Positive transpose = capo up that many frets
 * Negative transpose = transpose down (no capo)
 */
export function calculateCapo(semitones: number): number {
    return Math.max(0, semitones);
}

/**
 * Get capo display text
 */
export function getCapoText(semitones: number): string {
    const capo = calculateCapo(semitones);

    if (capo === 0) {
        return 'Original Key';
    }

    return `Capo: Fret ${capo}`;
}

/**
 * Get transpose display text
 */
export function getTransposeText(semitones: number): string {
    if (semitones === 0) return '0';
    if (semitones > 0) return `+${semitones}`;
    return `${semitones}`;
}
