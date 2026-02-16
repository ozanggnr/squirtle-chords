# Squirtle Chords 🐢🎸

A modern, free platform for guitar chords and tabs with document upload, chord transposition, and external API integration.

![Platform Preview](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)

## 🌟 Features

- **📚 Song Library**: Browse thousands of chords and tabs
- **🔍 Smart Search**: Full-text search with Songsterr API integration
- **📄 Document Upload**: Upload PDF/DOCX files and auto-extract chords
- **🎵 Chord Transposer**: Transpose songs to any key in real-time
- **🎨 Premium UI**: Modern dark theme with smooth animations
- **🔐 User Authentication**: JWT-based auth system
- **🌐 Multi-language**: Turkish and English songs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/ozanggnr/squirtle-chords.git
cd squirtle-chords
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000" > .env

# Start server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
squirtle-chords/
├── server/              # Express.js backend
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (API, file parsing)
│   ├── middleware/      # Auth middleware
│   └── uploads/         # Temp file storage
├── client/              # Next.js frontend
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── utils/           # Helper utilities
│   └── public/          # Static assets
└── README.md
```

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
MONGO_URI=mongodb://localhost:27017/squirtle-chords
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/squirtle-chords

JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### Frontend (Optional)
Create `client/.env.local` if you need custom API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Core Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - Authentication
- **multer** - File uploads
- **pdf-parse** - PDF extraction
- **mammoth** - DOCX extraction
- **axios** - HTTP client for external APIs

### Frontend
- **Next.js 14** - React framework
- **TailwindCSS** - Styling
- **axios** - HTTP client
- **lucide-react** - Icons

## 🎯 Key Features Detail

### 1. Document Upload & Parsing
Upload PDF or DOCX files containing song chords. The system automatically:
- Extracts text content
- Detects chord patterns
- Suggests title and artist
- Allows editing before publishing

### 2. Chord Transposition
Real-time chord transposition with:
- +/- semitone controls
- Chord notation mapping (C → C# → D)
- Visual highlighting (chords in blue, lyrics in gray)

### 3. External API Integration
Songsterr API integration for expanded song library:
- Searches Songsterr when local results are limited
- Caches external songs locally
- Visual badges to indicate source

### 4. Premium UI/UX
- Custom turtle mascot character
- Gradient backgrounds and glow effects
- Smooth animations and transitions
- Responsive mobile design

## 🌐 Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions covering:
- Vercel (Frontend)
- Railway/Render (Backend)
- MongoDB Atlas (Database)
- Environment configuration
- Custom domain setup

## 📝 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: { username, email, password }

# Login
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

### Songs
```bash
# Get all songs (with filters)
GET /api/songs?search=wonderwall&language=English

# Get single song
GET /api/songs/:id

# Create song (requires auth)
POST /api/songs
Headers: { Authorization: "Bearer <token>" }
Body: { title, artist, language, type, content }
```

### Upload
```bash
# Upload document (requires auth)
POST /api/upload
Headers: { Authorization: "Bearer <token>" }
Body: FormData with 'document' file
```

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- File type validation
- File size limits (5MB)
- CORS configuration
- Protected routes

## 🛠️ Development Scripts

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Production start
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run ESLint
```

## 📊 Database Schema

### User
- username, email, password (hashed)
- timestamps

### Song
- title, artist, language, type
- content (chord/tab text)
- source (local/songsterr)
- externalId, tabTypes
- createdBy (User reference)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Songsterr API for external song data
- Next.js and Express.js communities
- All open-source contributors

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ by [ozanggnr](https://github.com/ozanggnr)
