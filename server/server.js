require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware - CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://squirtle-chords-production.up.railway.app',
        'https://endearing-caring-production-ab25.up.railway.app'
    ],
    credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

app.get('/', (req, res) => {
    res.send('Squirtle Chords API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/seed', require('./routes/seed'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
