# ================================================
# Git Setup and Push to GitHub - Command Script
# ================================================
# Run these commands one by one in PowerShell

# Step 1: Navigate to project directory
cd "c:/Users/ozang/OneDrive/Desktop/squirtle chords/squirtle-chords"

# Step 2: Initialize Git repository
git init

# Step 3: Add all files to staging
git add .

# Step 4: Create initial commit
git commit -m "Initial commit: Complete Squirtle Chords platform with all features

Features:
- User authentication (JWT)
- Song CRUD with search
- Songsterr API integration
- PDF/DOCX upload & parsing
- Chord transposition
- Premium UI with mascot
- Responsive design"

# Step 5: Set main branch
git branch -M main

# Step 6: Add GitHub remote
git remote add origin https://github.com/ozanggnr/squirtle-chords.git

# Step 7: Push to GitHub
git push -u origin main

# ================================================
# If you encounter authentication issues:
# ================================================
# GitHub now requires Personal Access Token (PAT) instead of password
# 
# Generate PAT:
# 1. Go to https://github.com/settings/tokens
# 2. Click "Generate new token (classic)"
# 3. Select scopes: repo (all)
# 4. Generate and copy token
# 5. Use token as password when pushing

# ================================================
# Alternative: Use GitHub Desktop
# ================================================
# 1. Download GitHub Desktop: https://desktop.github.com/
# 2. Sign in with your GitHub account
# 3. File → Add Local Repository
# 4. Select: c:/Users/ozang/OneDrive/Desktop/squirtle chords/squirtle-chords
# 5. Click "Publish repository"
# 6. Uncheck "Keep this code private" if you want it public
# 7. Click "Publish"

# ================================================
# Verify Push
# ================================================
# After pushing, go to:
# https://github.com/ozanggnr/squirtle-chords
# 
# You should see all your files!
