/**
 * Chord Utilities for Frontend
 * Smart chord detection and syntax highlighting
 */

export interface ChordLine {
    content: string;
    isChord: boolean;
    highlighted?: string;
}

/**
 * Chord pattern regex - matches most guitar chords
 */
const CHORD_PATTERN = /\b[A-G][#b]?(m|maj|min|dim|aug|sus)?[0-9]*(b[0-9]+|#[0-9]+)?(add[0-9]+|sus[24])?\b/g;

/**
 * Detect if a line contains a [CHORDS] marker
 */
export function isMarkedChordLine(line: string): boolean {
    return line.startsWith('[CHORDS]');
}

/**
 * Remove [CHORDS] marker from line
 */
export function removeChordMarker(line: string): string {
    return line.replace(/^\[CHORDS\]/, '');
}

/**
 * Detect if line is primarily chords (fallback if no marker)
 */
export function isChordLine(line: string): boolean {
    if (!line || line.trim().length === 0) return false;

    // Check for marker first
    if (isMarkedChordLine(line)) return true;

    const chordMatches = line.match(CHORD_PATTERN) || [];
    const wordMatches = line.match(/\b[a-z]{3,}\b/gi) || [];

    const actualWords = wordMatches.filter(word => {
        return !word.match(CHORD_PATTERN);
    });

    const hasEnoughChords = chordMatches.length >= 2;
    const chordRatio = chordMatches.length / (chordMatches.length + actualWords.length + 1);

    return hasEnoughChords && chordRatio > 0.5;
}

/**
 * Highlight chords in a line with HTML
 */
export function highlightChords(line: string): string {
    // Remove marker if present
    const cleanLine = removeChordMarker(line);

    // Replace chords with highlighted spans
    return cleanLine.replace(CHORD_PATTERN, (chord) => {
        return `<span class="chord">${chord}</span>`;
    });
}

/**
 * Parse content into lines with chord detection
 */
export function parseContent(content: string): ChordLine[] {
    if (!content) {
        return [];
    }

    return content.split('\n').map(line => {
        const isChord = isChordLine(line);
        const cleanLine = isChord ? removeChordMarker(line) : line;

        return {
            content: cleanLine,
            isChord,
            highlighted: isChord ? highlightChords(line) : cleanLine,
        };
    });
}

/**
 * Extract only chord lines (for chords-only mode)
 */
export function extractChordLines(content: string): string {
    return content
        .split('\n')
        .filter(line => {
            // Keep section markers and chord lines
            return line.match(/\[(Verse|Chorus|Bridge|Intro|Outro|Solo).*?\]/i) || isChordLine(line);
        })
        .map(line => removeChordMarker(line))
        .join('\n');
}

/**
 * Detect song structure/sections
 */
export function extractSections(content: string): string[] {
    const sectionPattern = /\[(Verse|Chorus|Bridge|Intro|Outro|Solo).*?\]/gi;
    const matches = content.match(sectionPattern) || [];
    return matches.map(s => s.replace(/[\[\]]/g, ''));
}

/**
 * Format content for display
 */
export function formatForDisplay(content: string, chordsOnly: boolean = false): string {
    if (chordsOnly) {
        return extractChordLines(content);
    }
    return content;
}
