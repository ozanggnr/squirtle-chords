/**
 * Validation Middleware
 * Request validation and error handling
 */

class ValidationMiddleware {
    /**
     * Validate file upload request
     */
    static validateFileUpload(req, res, next) {
        const { title, artist } = req.body;
        const file = req.file;

        const errors = [];

        // Validate title
        if (!title || title.trim().length === 0) {
            errors.push('Song title is required');
        } else if (title.length > 200) {
            errors.push('Song title must be less than 200 characters');
        }

        // Validate artist
        if (!artist || artist.trim().length === 0) {
            errors.push('Artist name is required');
        } else if (artist.length > 200) {
            errors.push('Artist name must be less than 200 characters');
        }

        // Validate file
        if (!file) {
            errors.push('File is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join('. '),
            });
        }

        next();
    }

    /**
     * Validate manual song creation
     */
    static validateManualSong(req, res, next) {
        const { title, artist, content } = req.body;

        const errors = [];

        // Validate title
        if (!title || title.trim().length === 0) {
            errors.push('Song title is required');
        } else if (title.length > 200) {
            errors.push('Song title must be less than 200 characters');
        }

        // Validate artist
        if (!artist || artist.trim().length === 0) {
            errors.push('Artist name is required');
        } else if (artist.length > 200) {
            errors.push('Artist name must be less than 200 characters');
        }

        // Validate content
        if (!content || content.trim().length === 0) {
            errors.push('Song content is required');
        } else if (content.length < 10) {
            errors.push('Song content must be at least 10 characters');
        } else if (content.length > 50000) {
            errors.push('Song content must be less than 50,000 characters');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join('. '),
            });
        }

        next();
    }

    /**
     * Validate API search request
     */
    static validateAPISearch(req, res, next) {
        const { title, artist } = req.query;

        const errors = [];

        if (!title || title.trim().length === 0) {
            errors.push('Title parameter is required');
        }

        if (!artist || artist.trim().length === 0) {
            errors.push('Artist parameter is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join('. '),
            });
        }

        next();
    }

    /**
     * Validate pagination parameters
     */
    static validatePagination(req, res, next) {
        let { page, limit } = req.query;

        // Set defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 20;

        // Validate ranges
        if (page < 1) page = 1;
        if (limit < 1) limit = 1;
        if (limit > 100) limit = 100; // Max 100 items per page

        // Attach to request
        req.pagination = { page, limit };

        next();
    }
}

module.exports = ValidationMiddleware;
