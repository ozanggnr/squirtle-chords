# Deployment Guide - Squirtle Chords

This guide covers deploying the Squirtle Chords platform to production.

## Table of Contents
1. [Database Setup (MongoDB Atlas)](#1-database-setup)
2. [Backend Deployment (Railway/Render)](#2-backend-deployment)
3. [Frontend Deployment (Vercel)](#3-frontend-deployment)
4. [Environment Variables](#4-environment-variables)
5. [Custom Domain](#5-custom-domain)

---

## 1. Database Setup (MongoDB Atlas)

### Create MongoDB Atlas Cluster (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster:
   - Choose **FREE** tier (M0)
   - Select region closest to your backend server
   - Cluster name: `squirtle-chords`

4. **Create Database User**:
   - Go to "Database Access"
   - Add New Database User
   - Username: `squirtle-admin` (or your choice)
   - Password: Generate secure password
   - Save credentials!

5. **Whitelist IP Addresses**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IPs of your deployment servers

6. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/squirtle-chords?retryWrites=true&w=majority
   ```
   - Replace `<username>` and `<password>` with your credentials
   - Keep this for backend deployment!

---

## 2. Backend Deployment

### Option A: Railway (Recommended)

1. **Sign up** at [Railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your `squirtle-chords` repository

3. **Configure Service**:
   - Root directory: `server`
   - Build command: (auto-detected)
   - Start command: `npm start`

4. **Environment Variables**:
   Go to Variables tab and add:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/squirtle-chords
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=5000
   ```

5. **Deploy**:
   - Railway auto-deploys on push to main
   - Note your backend URL: `https://squirtle-chords-production.up.railway.app`

### Option B: Render

1. **Sign up** at [Render.com](https://render.com)

2. **New Web Service**:
   - Connect GitHub repository
   - Name: `squirtle-chords-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Deploy**: Render auto-deploys on push

---

## 3. Frontend Deployment (Vercel)

### Deploy to Vercel (Best for Next.js)

1. **Sign up** at [Vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New Project"
   - Import `squirtle-chords` from GitHub
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `client`

3. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   ⚠️ Replace with your actual Railway/Render backend URL

4. **Deploy**:
   - Click "Deploy"
   - Vercel automatically deploys on every push to main
   - You get a URL: `https://squirtle-chords.vercel.app`

5. **Update Backend CORS**:
   In `server/server.js`, update CORS:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://squirtle-chords.vercel.app', // Add your Vercel URL
       'https://your-custom-domain.com'      // If using custom domain
     ],
     credentials: true
   }));
   ```

---

## 4. Environment Variables Summary

### Backend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `my-super-secret-key-123` |
| `PORT` | Server port (usually 5000) | `5000` |

### Frontend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourdomain.com` |

---

## 5. Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `squirtlechords.com`)
3. Update DNS records at your domain provider:
   - Type: `A` or `CNAME`
   - Value: Vercel's provided DNS

### For Railway (Backend)
1. Go to Settings → Domains
2. Add custom domain (e.g., `api.squirtlechords.com`)
3. Update DNS with Railway's provided records

---

## 6. Post-Deployment Checklist

- [ ] Database is accessible and seeded
- [ ] Backend API is live and responding
- [ ] Frontend loads correctly
- [ ] Authentication works (register/login)
- [ ] File upload works
- [ ] Songsterr API integration works
- [ ] Chord transpose feature works
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Custom domain (if applicable) is connected

---

## 7. Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy**:
   - Vercel rebuilds frontend automatically
   - Railway rebuilds backend automatically
   - Zero-downtime deployments

---

## 8. Monitoring & Logs

### Vercel
- Go to Deployments → Select deployment → "View Function Logs"
- Real-time logs for debugging

### Railway
- Go to your service → "View Logs"
- Real-time backend logs

### MongoDB Atlas
- Go to "Metrics" for database performance
- "Database Access" for user management

---

## 9. Cost Estimate

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **MongoDB Atlas** | 512MB storage, shared | $9/mo for 2GB |
| **Railway** | $5 credit/mo | Pay-as-you-go (~$5-10/mo) |
| **Vercel** | Unlimited hobby projects | $20/mo Pro |

**Total Free Tier**: Fully functional at **$0/month** for hobby use!

---

## 10. Troubleshooting

### Issue: Backend 502 Error
- Check Railway/Render logs
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access

### Issue: CORS Error
- Add frontend URL to backend CORS whitelist
- Redeploy backend after changes

### Issue: Login Not Working
- Verify `JWT_SECRET` is set
- Check browser console for errors
- Verify backend API URL in frontend

### Issue: File Upload Failing
- Check file size limit (5MB)
- Verify multer middleware is working
- Check backend logs

---

## 11. Scaling for Production

When ready to scale:

1. **Database**: Upgrade MongoDB Atlas to M10+ tier
2. **Backend**: Add autoscaling on Railway
3. **Frontend**: Vercel handles automatically
4. **CDN**: Vercel includes global CDN
5. **Caching**: Add Redis for search caching

---

## Need Help?

- Check backend logs on Railway/Render
- Check frontend logs on Vercel
- Review MongoDB Atlas metrics
- Open issue on GitHub

---

**Congratulations! Your Squirtle Chords platform is now live! 🎉**
