# 🚀 Deployment Guide - RAG Resume Hackathon Project

## Quick Links for Hackathon Submission

After deployment, you'll have:
- **Frontend URL**: `https://your-app.vercel.app` (for UI demo)
- **Backend API URL**: `https://your-api.render.com` (for API endpoint)

---

## 📋 Prerequisites

Before deploying, make sure you have:
- [x] GitHub account (already done ✅)
- [ ] Vercel account (for frontend)
- [ ] Render account (for backend)
- [ ] MongoDB Atlas account (free tier)
- [ ] OpenAI API key

---

## Part 1: Deploy Backend API 🔧

### Step 1: Setup MongoDB Atlas (Free)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Create** a free account
3. **Create a cluster**:
   - Choose **FREE** M0 tier
   - Select region closest to you
   - Click "Create Cluster"
4. **Setup Database Access**:
   - Click "Database Access" → "Add New Database User"
   - Username: `resumerag`
   - Password: Generate a strong password (save it!)
   - User Privileges: "Read and write to any database"
5. **Setup Network Access**:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is safe for this deployment
6. **Get Connection String**:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://resumerag:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/resumerag?retryWrites=true&w=majority`

### Step 2: Deploy Backend to Render

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Shaktiprasadram22/RAG_Resume`
   - Name: `resumerag-api`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

4. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string_from_step1
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your-super-secret-jwt-key-change-this-12345
   JWT_EXPIRE=7d
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

   **Important**: 
   - Replace MongoDB URI with yours from Step 1
   - Get OpenAI API key from https://platform.openai.com/api-keys
   - Generate a random JWT_SECRET (any long random string)
   - You'll update CORS_ORIGINS after deploying frontend

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your API will be at: `https://resumerag-api.onrender.com`

6. **Test Your API**:
   - Visit: `https://resumerag-api.onrender.com/health`
   - Should see: `{"status": "OK", "message": "ResumeRAG API is running"}`

---

## Part 2: Deploy Frontend 🎨

### Step 1: Update Frontend API URL

Before deploying, update your frontend to use the deployed backend:

1. **Find your API config file**:
   - Location: `frontend/src/api/api.js` or similar

2. **Update the base URL**:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://resumerag-api.onrender.com';
   ```

3. **Commit and push**:
   ```bash
   cd "c:\RAG Resume"
   git add .
   git commit -m "Update API URL for deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Import `Shaktiprasadram22/RAG_Resume`
4. **Configure Project**:
   - Framework Preset: **Create React App**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://resumerag-api.onrender.com
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be at: `https://rag-resume-xxx.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Render dashboard**
2. **Click your web service** (`resumerag-api`)
3. **Go to Environment**
4. **Update CORS_ORIGINS**:
   ```
   CORS_ORIGINS=https://your-actual-frontend-url.vercel.app
   ```
5. **Save Changes** (will auto-redeploy)

---

## Part 3: Testing Your Deployment ✅

### Test Backend API
Visit these URLs in your browser:

1. **Health Check**:
   ```
   https://resumerag-api.onrender.com/health
   ```
   Expected: `{"status": "OK", ...}`

2. **API Test** (use Postman or browser):
   ```
   https://resumerag-api.onrender.com/api/dashboard/stats
   ```

### Test Frontend
1. **Visit**: `https://your-app.vercel.app`
2. **Check**:
   - [ ] Page loads with black/amber theme
   - [ ] Can see login page
   - [ ] Can create account
   - [ ] Can login
   - [ ] Dashboard loads

---

## 📝 For Hackathon Submission

### URLs to Submit:

**Live Application URL**:
```
https://your-app.vercel.app
```

**Backend API URL**:
```
https://resumerag-api.onrender.com
```

**GitHub Repository**:
```
https://github.com/Shaktiprasadram22/RAG_Resume
```

### Demo Credentials

Create a demo account through the app, or add these to your submission:
```
Recruiter Account:
- Email: demo.recruiter@resumerag.com
- Password: Demo@123

Candidate Account:
- Email: demo.candidate@resumerag.com
- Password: Demo@123
```

---

## 🔧 Alternative Deployment Options

### Backend Alternatives:
1. **Railway.app** (Similar to Render, easy setup)
2. **Heroku** (More established, but requires credit card)
3. **Fly.io** (Good free tier)

### Frontend Alternatives:
1. **Netlify** (Similar to Vercel)
2. **GitHub Pages** (Free, but needs configuration)
3. **Firebase Hosting** (Good integration with Google services)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: API not responding
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Check MongoDB connection string is correct

**Problem**: CORS errors
- Make sure CORS_ORIGINS includes your frontend URL
- Include `https://` in the URL
- No trailing slash

**Problem**: OpenAI API errors
- Verify API key is valid
- Check if you have API credits
- OpenAI free tier has rate limits

### Frontend Issues

**Problem**: Can't connect to backend
- Check REACT_APP_API_URL is correct
- Open browser console for errors
- Test backend health endpoint directly

**Problem**: Build fails
- Check for any console errors in local dev
- Make sure all dependencies are in package.json
- Try `npm install` and `npm run build` locally

**Problem**: Environment variables not working
- In Vercel, variables must start with `REACT_APP_`
- Redeploy after adding variables
- Clear cache and redeploy

---

## 💰 Free Tier Limits

**Render (Backend)**:
- 750 hours/month (enough for 24/7)
- Spins down after 15 min inactivity
- First request after sleep takes ~30 seconds

**Vercel (Frontend)**:
- 100 GB bandwidth/month
- Unlimited deployments
- Always fast, no cold starts

**MongoDB Atlas**:
- 512 MB storage
- Shared resources
- Perfect for demos/hackathons

**OpenAI API**:
- $5 free credits (new accounts)
- ~100,000 tokens
- Enough for hackathon demo

---

## 📞 Quick Help

### Keep Backend Awake
Render free tier sleeps after 15 min. To keep it awake:
1. Use a cron job service (cron-job.org)
2. Ping your health endpoint every 10 minutes
3. URL to ping: `https://resumerag-api.onrender.com/health`

### Quick Health Check Script
Create this file: `health-check.js`
```javascript
// Run this periodically to keep backend alive
fetch('https://resumerag-api.onrender.com/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend is alive:', data))
  .catch(err => console.log('❌ Backend error:', err));
```

---

## ✨ Final Checklist

Before submitting to hackathon:

- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] Can create account and login
- [ ] Main features work (upload resume, search, etc.)
- [ ] Mobile responsive (test on phone)
- [ ] Demo credentials ready
- [ ] GitHub repo is public
- [ ] README.md updated with deployment URLs
- [ ] Screenshots/video demo prepared

---

## 🎉 You're Ready!

Your RAG Resume application is now live and ready for hackathon submission!

**Need help?** Check the logs in Render/Vercel dashboards for errors.

Good luck with your hackathon! 🚀
