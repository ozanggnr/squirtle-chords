/**
 * Simple File Parser for In-Memory Mode
 * Basic text extraction without native dependencies
 */

class FileParserService {
    static async parseFile(file) {
        // For in-memory mode, just extract basic text from buffer
        const content = file.buffer.toString('utf-8');

        return {
            content: content || 'Sample chord content\n\nC  G  Am  F\nChords extracted from file',
            metadata: {
                hasChords: true,
                isTabs: false,
                sections: [],
            },
            warning: 'File parsing simplified in test mode',
        };
    }

    static validateFile(file) {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB

        if (!file) {
            throw new Error('No file provided');
        }

        if (file.size > MAX_SIZE) {
            throw new Error('File too large. Maximum size is 10MB.');
        }

        return true;
    }
}

module.exports = FileParserService;
