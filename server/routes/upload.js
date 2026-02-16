const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileParser = require('../services/fileParser');
const { protect } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// @desc    Upload and parse document
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { path: filePath, mimetype } = req.file;

        // Parse file
        const parsed = await fileParser.parse(filePath, mimetype);

        // Extract metadata
        const metadata = fileParser.extractMetadata(parsed.content);

        res.status(200).json({
            success: true,
            data: {
                title: metadata.title,
                artist: metadata.artist,
                content: parsed.content,
                chordCount: parsed.chordCount
            }
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({
            message: error.message || 'Error processing file'
        });
    }
});

module.exports = router;
