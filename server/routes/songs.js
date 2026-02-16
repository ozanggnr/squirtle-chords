const express = require('express');
const router = express.Router();
const { createSong, getSongs, getSong } = require('../controllers/songs');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getSongs)
    .post(protect, createSong);

router.route('/:id')
    .get(getSong);

module.exports = router;
