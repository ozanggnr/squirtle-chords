# 🎸 ChordFlow - Professional Guitar Chord & Tab Viewer

<div align="center">

![ChordFlow](https://img.shields.io/badge/ChordFlow-v1.0-8b5cf6?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js)

**A beautiful, feature-rich guitar chord viewer with transpose, auto-scroll, and PWA support.**

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🎵 Core Features
- **📋 Chord Library** - Browse and search guitar chords and tabs
- **➕ Manual Entry** - Add your own songs with custom chords
- **📁 File Upload** - Upload PDF/DOCX chord sheets (simplified parsing)
- **❤️ Favorites** - Save your favorite songs locally
- **🔍 Smart Search** - Find songs by title or artist

### 🎛️ Professional Tools
- **🎚️ Transpose** - Shift chords up/down by semitones (-6 to +6)
- **📐 Capo Calculator** - Automatic capo fret recommendations
- **⏩ Auto-Scroll** - Hands-free scrolling with adjustable speed (1x-5x)
- **🔤 Sorting** - Organize by title, artist, or date (A-Z / Z-A)
- **💡 Syntax Highlighting** - Color-coded chord display

### 🎨 User Experience
- **🌙 Dark/Light Mode** - Premium dark theme + light mode toggle
- **📱 PWA Support** - Install as app, works offline
- **✨ Smooth Animations** - Framer Motion powered UI
- **🎯 Clean Design** - Glassmorphism & modern aesthetics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### One-Click Startup (Windows)
```powershell
# Clone repository
git clone https://github.com/ozanggnr/squirtle-chords.git
cd squirtle-chords

# Install dependencies
cd server && npm install
cd ../client && npm install
cd ..

# Start app (one command!)
.\start.ps1
```

The app will automatically:
1. Start backend server (port 3000)
2. Start frontend server (port 5173)
3. Open browser to http://localhost:5173

### Manual Startup
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Then open http://localhost:5173

---

## 📖 Usage

### Adding Songs

#### Manual Entry
1. Click **"Add Song"** button
2. Fill in title, artist, and chords
3. Use `[CHORDS]` marker for chord lines
4. Click **"Add Song"**

**Example Format:**
```
[Verse 1]
[CHORDS]    G    D    Em   C
I found a love for me
[CHORDS]    G    D    Em   C
Darling, just dive right in
```

#### File Upload
1. Click **"Upload"** button
2. Select PDF or DOCX file
3. Songs are automatically parsed and added

### Viewing & Playing Songs

#### Transpose Chords
1. Open any song
2. Click **+** or **−** buttons to transpose
3. Chords update instantly in real-time
4. See capo position (e.g., "Capo: Fret 2")

#### Auto-Scroll
1. Open a song
2. Click **▶ Auto-scroll** button
3. Adjust speed slider (1x - 5x)
4. Click **⏸ Pause** to stop

#### Organize Songs
1. On homepage, use **Sort by** dropdown
2. Select: Title, Artist, or Date Added
3. Toggle **↑ A-Z** / **↓ Z-A** for order

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **CORS** - Cross-origin support
- **Multer** - File uploads
- **Rate Limiting** - Security
- **DOMPurify** - Input sanitization

### Storage
- **In-Memory** - Fast development mode
- **LocalStorage** - Favorites persistence

---

## 📂 Project Structure

```
squirtle-chords/
├── client/                 # Frontend (React + TypeScript)
│   ├── public/            
│   │   ├── sw.js          # Service worker for PWA
│   │   └── manifest.json  # PWA manifest
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ChordDisplay.tsx    # Main chord viewer
│   │   │   ├── SongCard.tsx        # Song grid item
│   │   │   └── ...
│   │   ├── pages/         # Route pages
│   │   │   ├── HomePage.tsx        # Main song list
│   │   │   ├── SongDetailPage.tsx  # Song viewer
│   │   │   └── ...
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useAutoScroll.ts    # Auto-scroll logic
│   │   │   ├── useFavorites.ts     # Favorites management
│   │   │   └── usePWA.ts           # PWA install
│   │   ├── utils/         # Utilities
│   │   │   ├── transposeUtils.ts   # Chord transposition
│   │   │   └── chordUtils.ts       # Chord parsing
│   │   └── services/      # API services
│   │       └── api.ts              # Backend API calls
│   └── package.json
│
├── server/                # Backend (Node + Express)
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   │   └── storageService.js   # In-memory storage
│   │   └── middleware/    # Express middleware
│   ├── server.js          # Entry point
│   └── package.json
│
├── start.ps1              # One-click startup script
└── README.md              # This file
```

---

## 🎯 Key Features Explained

### Transpose & Capo

**How it works:**
- Transpose shifts all chords by semitones
- Positive transpose = capo up
- Algorithm handles complex chords (Gmaj7, Dsus4, etc.)

**Example:**
```
Original:     C    G    Am   F
Transpose +2: D    A    Bm   G
Display:      "Capo: Fret 2"
```

### Auto-Scroll

**Controls:**
- **Speed**: 1x (slow) → 5x (fast)
- **Smooth**: 50ms intervals for fluid motion
- **Auto-stop**: Pauses at page bottom

**Use case**: Perfect for hands-free practice while playing guitar

### Sorting

**Options:**
- **Title**: Alphabetical by song name
- **Artist**: Alphabetical by artist name  
- **Date**: Chronological by upload date
- **Order**: Ascending (A→Z) or Descending (Z→A)

---

## 🔧 Development

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=http://localhost:3000
```

### Available Scripts

**Backend:**
```bash
npm run dev        # Start dev server with nodemon
npm start          # Start production server
```

**Frontend:**
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Adding New Features

1. **Frontend components**: Add to `client/src/components/`
2. **API endpoints**: Add to `server/src/routes/`
3. **Business logic**: Add to `server/src/services/`
4. **Utilities**: Add to `client/src/utils/`

---

## 📱 PWA Installation

ChordFlow works as a Progressive Web App:

1. **Desktop**: Click install icon in address bar
2. **Mobile**: "Add to Home Screen" from browser menu
3. **Offline**: Service worker caches content

---

## 🎨 Design Philosophy

- **Premium aesthetics** with glassmorphism and neon accents
- **Smooth animations** for delightful user experience
- **Mobile-first** responsive design
- **Accessibility** built-in (ARIA labels, keyboard nav)

---

## 🐛 Known Limitations

- **File parsing**: Simplified (best with manual entry)
- **Database**: In-memory only (data resets on server restart)
- **Max songs**: No pagination limit enforced

### Future Enhancements
- 🗄️ Persistent database (SQLite/MongoDB)
- 🎼 Advanced PDF parsing
- 🎸 Chord diagrams
- 🎵 Audio playback integration
- 👥 User accounts & sharing

---

## 📄 License

MIT License - feel free to use for any purpose!

---

## 🙏 Credits

Built with ❤️ using modern web technologies.

**Key Libraries:**
- React, TypeScript, Vite
- Tailwind CSS, Framer Motion
- Express, Node.js

---

<div align="center">

**[⭐ Star this repo](https://github.com/ozanggnr/squirtle-chords)** if you find it useful!

Made with 🎸 by [ozanggnr](https://github.com/ozanggnr)

</div>
