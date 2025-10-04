# ResumeRAG - Full Stack Integration Guide

Complete guide for testing the integrated frontend and backend application.

## 🎯 Overview

This guide will walk you through:
1. Setting up environment variables
2. Starting both servers
3. Testing each feature end-to-end
4. Troubleshooting common issues

## 📋 Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] MongoDB running (local or Atlas)
- [ ] OpenAI API key (optional, for AI features)
- [ ] Both frontend and backend dependencies installed

## ⚙️ Step 1: Environment Setup

### Backend Environment (.env)

Navigate to `backend/` and create `.env` from the example:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/resumerag
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumerag

# OpenAI Configuration (IMPORTANT: Get your key from platform.openai.com)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-random-secret-key-here

# CORS Origins
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment (.env)

The frontend `.env` is already created with:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Step 2: Start the Servers

### Terminal 1: Start MongoDB (if local)

```bash
mongod
```

### Terminal 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
📊 Database: resumerag
🚀 ResumeRAG Server Started Successfully!
📡 Server running on: http://localhost:5000
```

### Terminal 3: Start Frontend

```bash
cd frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view resumerag-frontend in the browser.
Local: http://localhost:3000
```

## 🧪 Step 3: End-to-End Testing

### Test 1: Backend Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "ResumeRAG API is running",
  "timestamp": "2025-10-04T08:30:00.000Z",
  "environment": "development"
}
```

### Test 2: Resume Upload & Parsing

1. **Open Frontend:** http://localhost:3000
2. **Navigate to:** Smart Resume Parsing section
3. **Upload a resume** (PDF or DOCX file)
4. **Click:** "🚀 Parse Resume"

**What to Look For:**
- ✅ Success message appears
- ✅ Preview shows parsed data (name, email, skills, etc.)
- ✅ Resume ID is displayed

**Backend Logs:**
```
[2025-10-04T08:30:15.000Z] POST /api/resume/upload - Status: 201 - Duration: 1234ms
```

**Testing with curl:**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@path/to/your/resume.pdf"
```

### Test 3: RAG-Powered Search

1. **Navigate to:** RAG-Powered Search section
2. **Enter job description:**
   ```
   Looking for a Senior React Developer with 5+ years of experience.
   Must have expertise in Node.js, MongoDB, and cloud technologies.
   ```
3. **Click:** "🔍 Search Resumes"

**What to Look For:**
- ✅ Loading state shows while searching
- ✅ Results display with match scores
- ✅ Skills are highlighted for each candidate

**Testing with curl:**
```bash
curl -X POST http://localhost:5000/api/resume/search \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Looking for a React developer with Node.js experience",
    "limit": 10
  }'
```

### Test 4: Job Match Recommendations

1. **Navigate to:** Job Match Recommendations section
2. **Select a resume** from the dropdown
3. **View recommendations**

**What to Look For:**
- ✅ Job list appears with match percentages
- ✅ Progress bars show match scores
- ✅ Job details (company, location, salary) display

**Testing with curl:**
```bash
# First, get a resume ID
RESUME_ID=$(curl -s http://localhost:5000/api/resume | jq -r '.data.resumes[0]._id')

# Then get recommendations
curl -X POST http://localhost:5000/api/jobs/recommend \
  -H "Content-Type: application/json" \
  -d "{\"resumeId\": \"$RESUME_ID\", \"limit\": 5}"
```

### Test 5: AI Summary Generation

1. **Navigate to:** AI Summary Generation section
2. **Select a resume**
3. **Click:** "✨ Generate Summary"

**What to Look For:**
- ✅ Loading state appears
- ✅ Professional summary is generated
- ✅ Copy to clipboard button works

**Note:** Requires OpenAI API key. If not configured, fallback summary is used.

### Test 6: Keyword Optimization

1. **Navigate to:** Keyword Optimization section
2. **Select a resume**
3. **Paste a job description**
4. **Click:** "🔍 Analyze Keywords"

**What to Look For:**
- ✅ Match score percentage displays
- ✅ ATS score and grade show
- ✅ Matched keywords highlighted in green
- ✅ Missing keywords highlighted in yellow
- ✅ Optimization suggestions listed

### Test 7: Interactive Dashboard

1. **Navigate to:** Interactive Dashboard section
2. **View analytics**

**What to Look For:**
- ✅ Statistics cards show data
- ✅ Top skills display (if resumes exist)
- ✅ Chart placeholders visible

**Testing with curl:**
```bash
curl http://localhost:5000/api/dashboard/stats
curl http://localhost:5000/api/dashboard/top-skills
```

### Test 8: RAG Chatbot

1. **Navigate to:** RAG Chatbot section
2. **Type a message:**
   ```
   Find me candidates with Python and Machine Learning skills
   ```
3. **Click:** "Send"

**What to Look For:**
- ✅ Greeting message appears on load
- ✅ User message displays on right
- ✅ Bot response appears on left
- ✅ Conversation history maintained

## 🔄 Complete Integration Flow

Here's a complete workflow to test all features:

### Step-by-Step Integration Test

```bash
# 1. Upload 3 resumes
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@resume1.pdf"
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@resume2.pdf"
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@resume3.pdf"

# 2. Create a job posting
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "company": "Tech Corp",
    "description": "We are looking for an experienced developer...",
    "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"],
    "experienceLevel": "senior",
    "type": "full-time"
  }'

# 3. Search for matching resumes
curl -X POST http://localhost:5000/api/resume/search \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Looking for a React and Node.js developer",
    "limit": 10
  }'

# 4. Get dashboard stats
curl http://localhost:5000/api/dashboard/stats
```

## 🐛 Troubleshooting

### Backend Won't Start

**Issue:** `MongoDB connection error`
```
Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGODB_URI in .env
3. For Atlas, check connection string and whitelist your IP
```

**Issue:** `Port 5000 already in use`
```
Solution:
1. Change PORT in backend/.env to 5001
2. Update REACT_APP_API_URL in frontend/.env to http://localhost:5001
3. Or kill process: lsof -ti:5000 | xargs kill (Mac/Linux)
```

### Frontend Won't Connect

**Issue:** `Network Error` or `CORS Error`
```
Solution:
1. Verify backend is running
2. Check REACT_APP_API_URL in frontend/.env
3. Ensure CORS_ORIGINS in backend/.env includes http://localhost:3000
4. Restart both servers
```

**Issue:** `404 on API calls`
```
Solution:
1. Check browser console for exact error
2. Verify API endpoints match in frontend/src/api/api.js
3. Check backend routes are registered in backend/index.js
```

### File Upload Issues

**Issue:** `File upload fails`
```
Solution:
1. Check file size (max 10MB)
2. Verify file format (PDF or DOCX only)
3. Check backend logs for detailed error
4. Ensure multer is installed: npm install multer
```

### AI Features Not Working

**Issue:** `OpenAI API errors`
```
Solution:
1. Verify OPENAI_API_KEY is set correctly in backend/.env
2. Check you have OpenAI credits
3. System will use fallback data if key is invalid
4. Test with: curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"
```

### No Data Showing

**Issue:** `Empty states everywhere`
```
Solution:
1. Upload some test resumes first
2. Create test job postings
3. Check MongoDB has data: mongo -> use resumerag -> db.resumes.find()
```

## 📊 Monitoring

### Backend Logs

Watch for these log entries:
```
✅ Success logs (green)
⚠️  Warning logs (yellow)
❌ Error logs (red)
[timestamp] METHOD /path - Status: XXX - Duration: XXms
```

### Frontend Console

Open browser DevTools (F12) and check:
- **Console:** For API call logs and errors
- **Network:** For request/response details
- **React DevTools:** For component state

## 🎯 Success Criteria

Your integration is successful when:

- [x] Backend health check returns 200 OK
- [x] Frontend loads without console errors
- [x] Resume upload works and shows parsed data
- [x] Search returns results
- [x] Job recommendations display
- [x] AI summary generates (or shows fallback)
- [x] Keyword analysis works
- [x] Dashboard shows statistics
- [x] Chatbot responds to messages

## 🚀 Next Steps

### For Development

1. **Add More Test Data:** Upload various resumes and create jobs
2. **Test Edge Cases:** Try invalid inputs, large files, etc.
3. **Monitor Performance:** Check response times in Network tab
4. **Add Features:** Implement additional functionality

### For Production

1. **Environment Variables:**
   - Use production MongoDB URI
   - Set NODE_ENV=production
   - Use strong JWT_SECRET
   - Configure production CORS_ORIGINS

2. **Deploy Backend:**
   - Heroku, Railway, Render, or AWS
   - Set environment variables in hosting platform
   - Enable HTTPS

3. **Deploy Frontend:**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or AWS S3
   - Update REACT_APP_API_URL to production backend URL

4. **Security:**
   - Implement rate limiting
   - Add authentication
   - Validate all inputs
   - Enable HTTPS

## 📞 Common Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server

# Frontend
cd frontend
npm install             # Install dependencies
npm start               # Start development server
npm run build          # Build for production

# MongoDB
mongod                  # Start MongoDB locally
mongo                   # Access MongoDB shell
use resumerag          # Switch to database
db.resumes.find()      # View resumes
db.jobs.find()         # View jobs

# Testing
curl http://localhost:5000/health                    # Backend health
curl http://localhost:5000/api/resume               # Get all resumes
curl http://localhost:5000/api/jobs                 # Get all jobs
curl http://localhost:5000/api/dashboard/stats      # Dashboard stats
```

## ✅ Integration Checklist

Use this checklist to verify everything works:

### Setup
- [ ] MongoDB is running
- [ ] Backend .env is configured
- [ ] Frontend .env is configured
- [ ] Dependencies installed (backend & frontend)

### Backend
- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] MongoDB connection successful
- [ ] All routes registered correctly

### Frontend
- [ ] App loads in browser
- [ ] No console errors
- [ ] All components render
- [ ] API calls work

### Features
- [ ] Resume upload & parsing
- [ ] RAG search
- [ ] Job recommendations
- [ ] AI summary generation
- [ ] Keyword optimization
- [ ] Dashboard analytics
- [ ] Chatbot interaction

### Integration
- [ ] Frontend connects to backend
- [ ] CORS configured correctly
- [ ] Data flows between systems
- [ ] Error handling works
- [ ] Loading states display

---

**Congratulations! Your ResumeRAG full-stack application is now integrated and ready to use!** 🎉

For questions or issues, check the README files in frontend/ and backend/ directories.
