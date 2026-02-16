# Git Setup & Push to GitHub

## 📋 Quick Start Guide

Follow these steps to push your code to GitHub.

---

## Step 1: Initialize Git (if not already done)

```bash
cd "c:/Users/ozang/OneDrive/Desktop/squirtle chords/squirtle-chords"

# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Squirtle Chords platform with all features"
```

---

## Step 2: Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/ozanggnr/squirtle-chords.git

# Verify remote
git remote -v
```

---

## Step 3: Create .gitignore (Important!)

Make sure you have a `.gitignore` file at the root to avoid pushing sensitive files:

**Root `.gitignore`**:
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production

# Next.js
client/.next/
client/out/
client/build/

# Production
dist/
build/

# Uploads
server/uploads/*
!server/uploads/.gitkeep

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
*.log
.env.test
