/**
 * Enhanced Song Routes
 * API endpoints with validation middleware
 */

const express = require('express');
const multer = require('multer');
const SongController = require('../controllers/songController');
const ValidationMiddleware = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads with memory storage
const upload = multer({
    storage: multer.memoryStorage(), // Store in memory for processing
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
        }
    },
});

// Song API routes with validation
router.get('/songs',
    ValidationMiddleware.validatePagination,
    SongController.getAllSongs
);

router.get('/songs/search',
    SongController.searchSongs
);

router.get('/songs/:id',
    SongController.getSongById
);

router.post('/songs/upload',
    upload.single('file'),
    ValidationMiddleware.validateFileUpload,
    SongController.uploadFile
);

router.post('/songs/manual',
    ValidationMiddleware.validateManualSong,
    SongController.createManualSong
);

router.post('/songs/fetch',
    ValidationMiddleware.validateAPISearch,
    SongController.fetchFromAPI
);

router.delete('/songs/:id',
    SongController.deleteSong
);

module.exports = router;
