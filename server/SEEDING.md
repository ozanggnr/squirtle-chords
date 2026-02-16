# Database Seeder - Quick Guide

## Purpose
Populates the database with sample songs (Turkish + English) so there's always data to display.

## Sample Data 
- 6 songs total
- 4 English (Wonderwall, Hotel California, Nothing Else Matters, Stairway to Heaven)
- 2 Turkish (Duman - Senden Daha Güzel, Mor ve Ötesi - Deli)

## Running Locally
```bash
cd server
npm run seed
```

## Running on Render
### Option 1: One-time manual run (SSH into instance)
1. Go to Render Dashboard → Your Service → Shell tab
2. Run: `cd server && node seed.js`

### Option 2: Auto-run on deployment
Add to `render.yaml` or Render settings:
```yaml
buildCommand: npm install && npm run seed
```

### Option 3: API endpoint (recommended for production)
Create a protected `/api/admin/seed` endpoint that requires authentication.

## What it does
- Removes all existing `source: 'local'` songs
- Inserts 6 sample songs
- Prints success/error summary

## Notes
- Safe to run multiple times (clears before inserting)
- Only affects songs with `source: 'local'` 
- External songs (Songsterr, etc.) are preserved
