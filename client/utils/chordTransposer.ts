// Chord transpose utility

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLATS_TO_SHARPS: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
};

export class ChordTransposer {
    /**
     * Transpose a single chord by semitones
     */
    static transposeChord(chord: string, semitones: number): string {
        // Match chord pattern: note + modifiers
        const chordPattern = /^([A-G][#b]?)(.*)/;
        const match = chord.match(chordPattern);

        if (!match) return chord;

        let [, note, modifiers] = match;

        // Convert flats to sharps for consistency
        if (FLATS_TO_SHARPS[note]) {
            note = FLATS_TO_SHARPS[note];
        }

        // Find current note index
        const currentIndex = NOTES.indexOf(note);
        if (currentIndex === -1) return chord;

        // Calculate new index (handle wrapping)
        const newIndex = (currentIndex + semitones + NOTES.length * 100) % NOTES.length;
        const newNote = NOTES[newIndex];

        return newNote + modifiers;
    }

    /**
     * Transpose all chords in a line
     */
    static transposeLine(line: string, semitones: number): string {
        // Chord pattern: matches common chord notations
        const chordPattern = /\b([A-G][#b]?(m|maj|min|dim|aug|sus)?(2|4|5|6|7|9|11|13)?)\b/g;

        return line.replace(chordPattern, (match) => {
            return this.transposeChord(match, semitones);
        });
    }

    /**
     * Transpose entire song content
     */
    static transposeContent(content: string, semitones: number): string {
        const lines = content.split('\n');
        return lines.map(line => this.transposeLine(line, semitones)).join('\n');
    }

    /**
     * Detect if a line is primarily chords (heuristic)
     */
    static isChordLine(line: string): boolean {
        const trimmed = line.trim();
        if (!trimmed) return false;

        // Pattern for chords
        const chordPattern = /\b[A-G][#b]?(m|maj|min|dim|aug|sus)?(2|4|5|6|7|9|11|13)?\b/g;
        const matches = trimmed.match(chordPattern);

        if (!matches) return false;

        // If more than 2 chord matches and the line is mostly spaces/chords
        const chordLength = matches.join('').length;
        const totalLength = trimmed.replace(/\s/g, '').length;

        return matches.length >= 2 && chordLength / totalLength > 0.6;
    }
}
