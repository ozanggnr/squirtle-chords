# Favicon & App Icon Generation Guide

## Overview
This document outlines how to create the PNG favicon assets from the SVG source.

## Required Assets
1. `favicon-16x16.png` - 16x16 pixels
2. `favicon-32x32.png` - 32x32 pixels  
3. `favicon-48x48.png` - 48x48 pixels (optional)
4. `apple-touch-icon.png` - 180x180 pixels

## Source File
Use `public/favicon.svg` as the source.

## Generation Methods

### Option 1: Online Tools (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload `public/favicon.svg`
3. Configure settings:
   - iOS: Use solid blue background
   - Android: Use solid blue background
   - Windows: Use solid blue background
4. Download the generated package
5. Place files in `public/` directory

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run these commands from the project root:

# 16x16
magick public/favicon.svg -resize 16x16 public/favicon-16x16.png

# 32x32
magick public/favicon.svg -resize 32x32 public/favicon-32x32.png

# Apple Touch Icon (180x180)
magick public/mascot.svg -resize 180x180 public/apple-touch-icon.png
```

### Option 3: Using GIMP/Photoshop
1. Open `public/favicon.svg` in GIMP or Photoshop
2. Export as PNG at required sizes:
   - 16x16
   - 32x32
   - 180x180 (for apple-touch-icon)
3. Ensure transparent background
4. Save to `public/` directory

### Option 4: Using Figma
1. Import `public/favicon.svg` into Figma
2. Resize artboard to target dimensions
3. Export as PNG
4. Repeat for all sizes

## File Placement
All favicon files should be placed in:
```
client/public/
  ├── favicon.svg (already created)
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  └── apple-touch-icon.png
```

## Verification
After placing files, the Next.js metadata in `app/layout.tsx` is already configured to use them.

Test by:
1. Running the dev server: `npm run dev`
2. Opening http://localhost:3000
3. Checking browser tab for favicon
4. Checking browser DevTools > Application > Manifest

## Notes
- SVG favicon works in modern browsers
- PNG fallbacks ensure compatibility with older browsers
- Apple Touch Icon is displayed when saving to iOS home screen
