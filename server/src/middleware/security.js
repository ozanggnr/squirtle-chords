/**
 * Security Middleware
 * Input sanitization and rate limiting
 */

const rateLimit = require('express-rate-limit');
const DOMPurify = require('isomorphic-dompurify');

/**
 * Rate limiter for API endpoints
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict rate limiter for upload endpoints
 */
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: {
        success: false,
        error: 'Upload limit exceeded. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Sanitize text input
 */
function sanitizeText(text) {
    if (!text) return '';

    // Remove HTML tags and scripts
    const cleaned = DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [], // No HTML allowed
        ALLOWED_ATTR: [],
    });

    return cleaned.trim();
}

/**
 * Sanitize song data
 */
function sanitizeSongData(req, res, next) {
    if (req.body.title) {
        req.body.title = sanitizeText(req.body.title);
    }

    if (req.body.artist) {
        req.body.artist = sanitizeText(req.body.artist);
    }

    if (req.body.content) {
        // For content, allow basic formatting but sanitize
        req.body.content = DOMPurify.sanitize(req.body.content, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });
    }

    next();
}

module.exports = {
    apiLimiter,
    uploadLimiter,
    sanitizeText,
    sanitizeSongData,
};
