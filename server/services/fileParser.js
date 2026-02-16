const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

class FileParser {
    constructor() {
        this.supportedTypes = ['pdf', 'docx'];
    }

    /**
     * Parse uploaded file based on MIME type
     * @param {string} filePath - Path to uploaded file
     * @param {string} mimetype - MIME type of file
     * @returns {Promise<{content: string, chordCount: number}>}
     */
    async parse(filePath, mimetype) {
        try {
            let rawText = '';

            if (mimetype === 'application/pdf') {
                rawText = await this.parsePDF(filePath);
            } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                rawText = await this.parseDOCX(filePath);
            } else {
                throw new Error('Unsupported file type');
            }

            // Process and detect chords
            const processed = this.processContent(rawText);

            // Clean up uploaded file
            await fs.unlink(filePath);

            return processed;
        } catch (error) {
            // Clean up on error
            try {
                await fs.unlink(filePath);
            } catch (unlinkError) {
                // Ignore cleanup errors
            }
            throw error;
        }
    }

    /**
     * Extract text from PDF
     */
    async parsePDF(filePath) {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    }

    /**
     * Extract text from DOCX
     */
    async parseDOCX(filePath) {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    /**
     * Process content: detect chords, format text
     */
    processContent(text) {
        const lines = text.split('\n');
        let chordCount = 0;

        // Regex for common chord patterns
        // Matches: C, Cm, C7, Cmaj7, C#m, Db, F#m7, etc.
        const chordPattern = /\b[A-G][#b]?(m|maj|min|dim|aug|sus)?(2|4|5|6|7|9|11|13)?\b/g;

        const processedLines = lines.map(line => {
            const matches = line.match(chordPattern);
            if (matches && matches.length >= 2) {
                // Likely a chord line
                chordCount += matches.length;
            }
            return line;
        });

        return {
            content: processedLines.join('\n'),
            chordCount
        };
    }

    /**
     * Try to extract metadata (title, artist) from first few lines
     */
    extractMetadata(content) {
        const lines = content.split('\n').filter(line => line.trim());

        // Simple heuristic: first 2 non-empty lines might be title and artist
        const title = lines[0] || 'Untitled';
        const artist = lines[1] || 'Unknown Artist';

        return { title, artist };
    }
}

module.exports = new FileParser();
