/**
 * Global Error Handler Middleware
 * Catches and formats errors for consistent API responses
 */

export function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'File too large. Maximum size is 10MB.',
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: err.message,
        });
    }

    // Default server error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
}

/**
 * 404 Not Found Handler
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Route not found',
    });
}
