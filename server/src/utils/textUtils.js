/**
 * Text Utilities for Chord Processing
 * Smart chord detection and text cleaning
 */

class TextUtils {
    /**
     * Chord pattern regex - matches most guitar chords
     * Examples: C, Dm, F#m, Gmaj7, Am7b5, Dsus4
     */
    static CHORD_PATTERNS = {
        // Comprehensive chord pattern
        full: /\b[A-G][#b]?(m|maj|min|dim|aug|sus)?[0-9]*(b[0-9]+|#[0-9]+)?(add[0-9]+|sus[24])?\b/g,

        // Simpler pattern for detection
        basic: /\b[A-G][#b]?(m|maj|min|dim|aug|sus)?[0-9]*\b/g,
    };

    /**
     * Clean raw text from file parsing
     */
    static cleanText(text) {
        if (!text) return '';

        return text
            // Normalize line breaks
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')

            // Convert tabs to spaces
            .replace(/\t/g, '  ')

            // Remove zero-width characters
            .replace(/[\u200B-\u200D\uFEFF]/g, '')

            // Collapse multiple spaces (but preserve alignment for chords)
            .replace(/ {4,}/g, '    ')

            // Max 2 consecutive line breaks
            .replace(/\n{3,}/g, '\n\n')

            // Trim each line
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n')

            // Trim overall
            .trim();
    }

    /**
     * Normalize whitespace while preserving chord alignment
     */
    static normalizeWhitespace(text) {
        return text
            .split('\n')
            .map(line => {
                // Preserve spaces in chord lines
                if (this.isChordLine(line)) {
                    return line.replace(/[ ]{2,}/g, '  '); // Max 2 spaces
                }
                // Normal text - single space
                return line.replace(/\s+/g, ' ').trim();
            })
            .join('\n');
    }

    /**
     * Detect if a line is primarily chords
     */
    static isChordLine(line) {
        if (!line || line.trim().length === 0) return false;

        // Match chords
        const chordMatches = line.match(this.CHORD_PATTERNS.basic) || [];

        // Match regular words (likely lyrics)
        const wordMatches = line.match(/\b[a-z]{3,}\b/gi) || [];

        // Filter out chords from word matches
        const actualWords = wordMatches.filter(word => {
            return !word.match(this.CHORD_PATTERNS.basic);
        });

        // Line is chords if:
        // 1. Has at least 2 chord-like patterns
        // 2. Ratio of chords to words > 50%
        // 3. Line is short enough to be chords (< 60 chars typically)

        const hasEnoughChords = chordMatches.length >= 2;
        const chordRatio = chordMatches.length / (chordMatches.length + actualWords.length + 1);
        const isShortEnough = line.trim().length < 80;

        return hasEnoughChords && chordRatio > 0.5 && isShortEnough;
    }

    /**
     * Detect chord patterns in text and mark them
     */
    static highlightChords(content) {
        return content
            .split('\n')
            .map(line => {
                if (this.isChordLine(line)) {
                    // Add marker for frontend to detect
                    return `[CHORDS]${line}`;
                }
                return line;
            })
            .join('\n');
    }

    /**
     * Format chord lines with proper spacing
     */
    static formatChordLines(content) {
        const lines = content.split('\n');
        const formatted = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (this.isChordLine(line)) {
                // Ensure chord line has proper spacing
                const cleanedChordLine = line
                    .replace(/\s+/g, ' ')  // Collapse spaces first
                    .replace(/([A-G][#b]?(?:m|maj|min|dim|aug|sus)?[0-9]*)/g, '  $1  ') // Add spacing around chords
                    .replace(/\s{3,}/g, '  ') // Max 2 spaces
                    .trim();

                formatted.push(cleanedChordLine);
            } else {
                formatted.push(line);
            }
        }

        return formatted.join('\n');
    }

    /**
     * Remove common artifacts from PDF parsing
     */
    static removePDFArtifacts(text) {
        return text
            // Remove page numbers
            .replace(/^\s*\d+\s*$/gm, '')

            // Remove common headers/footers
            .replace(/^(Page|page)\s+\d+.*$/gm, '')

            // Remove excessive dashes/underscores
            .replace(/[-_]{5,}/g, '')

            // Remove bullet points
            .replace(/^[•·∙○●]\s+/gm, '');
    }

    /**
     * Validate that content looks like chords/tabs
     */
    static validateContent(content) {
        if (!content || content.trim().length < 10) {
            return { valid: false, reason: 'Content too short' };
        }

        const lines = content.split('\n').filter(l => l.trim());

        // Check for at least some chord patterns
        const chordLines = lines.filter(line => this.isChordLine(line));

        if (chordLines.length === 0) {
            return {
                valid: true,
                warning: 'No chords detected - may be lyrics only'
            };
        }

        return { valid: true };
    }

    /**
     * Extract metadata from content
     */
    static extractMetadata(content) {
        const metadata = {
            hasChords: false,
            isTabs: false,
            sections: [],
        };

        // Detect chord lines
        const lines = content.split('\n');
        const chordLines = lines.filter(line => this.isChordLine(line));
        metadata.hasChords = chordLines.length > 0;

        // Detect tab notation (e|B|G|D|A|E guitar strings)
        metadata.isTabs = /[eEBGDAE]\|[\d-]+/.test(content);

        // Extract sections like [Verse], [Chorus], etc.
        const sectionPattern = /\[(Verse|Chorus|Bridge|Intro|Outro|Solo).*?\]/gi;
        const sections = content.match(sectionPattern) || [];
        metadata.sections = sections.map(s => s.replace(/[\[\]]/g, ''));

        return metadata;
    }
}

module.exports = TextUtils;
