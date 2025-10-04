# 🔧 ResumeRAG Troubleshooting Guide

## Common Errors & Solutions

### 1. ❌ PDF Parsing Failed

**Error:** "Failed to parse PDF file"

**Possible Causes & Solutions:**

#### A. Server Not Running
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not running, start it:
cd backend
npm run dev
```

#### B. PDF File Issues
- **File Size:** Must be under 10MB
- **File Type:** Must be actual PDF (not renamed file)
- **Corrupted PDF:** Try a different PDF file
- **Password Protected:** Remove password from PDF

**Test with a simple PDF:**
1. Create a test PDF with just text (no images/complex formatting)
2. Try uploading that first

#### C. Missing Dependencies
```bash
cd backend
npm install pdf-parse@1.1.1 --save
npm install mammoth --save
npm install
```

#### D. Buffer Issues
Check backend console logs for:
```
📄 Attempting to parse PDF...
✅ pdf-parse loaded successfully
📦 PDF buffer size: XXXX bytes
```

If you see "PDF buffer is empty", the file isn't being uploaded correctly.

---

### 2. ⚠️ OpenAI API Key Error

**Error:** "OpenAI apiKey is required"

**Solution:**

```bash
# Edit backend/.env
cd backend
notepad .env

# Make sure this line exists:
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Save and restart server
npm run dev
```

**The app works WITHOUT OpenAI key** - it will use fallback data!

---

### 3. 🔌 MongoDB Connection Failed

**Error:** "MongoDB connection error"

**Solutions:**





#### B. MongoDB Atlas Network Access
1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Add: `0.0.0.0/0` (allows all IPs for development)
4. Click "Confirm"

#### C. Check Password
- Ensure no special characters in password that need URL encoding
- Check your MongoDB Atlas dashboard for the correct password

#### D. Test Connection
```bash


---

### 4. 🌐 Frontend Can't Connect to Backend

**Error:** "Network Error" or "Failed to fetch"

**Checklist:**

✅ **Backend is running:** Check terminal shows:
```
🚀 ResumeRAG Server Started Successfully!
📡 Server running on: http://localhost:5000
```

✅ **Frontend .env is correct:**
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000
```

✅ **CORS is configured:** Check `backend/.env`:
```env
CORS_ORIGINS=http://localhost:3000
```

✅ **Test backend directly:**
```bash
curl http://localhost:5000/health
```

✅ **Restart frontend after .env changes:**
```bash
cd frontend
# Stop with Ctrl+C
npm start
```

---

### 5. 📦 Module Not Found: axios

**Error:** "Can't resolve 'axios'"

**Solution:**
```bash
cd frontend
npm install axios
```

---

### 6. 🚫 Port Already in Use

**Error:** "Port 5000 already in use"

**Solution:**

#### Option A: Kill the process
```powershell
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

#### Option B: Use different port
```env
# backend/.env
PORT=5001

# frontend/.env
REACT_APP_API_URL=http://localhost:5001
```

---

### 7. ⚡ Nodemon Crash Loop

**Error:** "[nodemon] app crashed - waiting for file changes"

**Check for:**

1. **Syntax errors** in your code
2. **Missing .env file:** Must exist in `backend/.env`
3. **Import errors:** Check all imports are correct

**View full error:**
```bash
cd backend
node index.js  # Run without nodemon to see full error
```

---

## 🔍 Debugging Steps

### Step 1: Check All Services

```bash
# 1. MongoDB Status (if local)
mongod --version

# 2. Backend Status
cd backend
npm run dev
# Look for: "✅ MongoDB Connected"

# 3. Frontend Status
cd frontend
npm start
# Should open http://localhost:3000
```

### Step 2: Test Each Component

```bash
# 1. Health Check
curl http://localhost:5000/health

# 2. Get Resumes
curl http://localhost:5000/api/resume

# 3. Dashboard
curl http://localhost:5000/api/dashboard/mock
```

### Step 3: Check Logs

**Backend Console:**
- Look for error messages
- Note the request logs: `[timestamp] POST /api/resume/upload`

**Frontend Console (Browser F12):**
- Check Network tab for failed requests
- Look for red error messages
- Check if API calls are reaching backend

---

## 🐛 Detailed Error Investigation

### For PDF Upload Issues:

1. **Check the backend logs** when you upload:
```
📄 Attempting to parse PDF...
✅ pdf-parse loaded successfully
📦 PDF buffer size: 12345 bytes
✅ PDF parsed successfully
```

2. **Check frontend Network tab** (F12):
- Request URL: `http://localhost:5000/api/resume/upload`
- Status: Should be `201 Created`
- Response: Should have `success: true`

3. **Try a simple text PDF first:**
- Create a PDF with just "Hello World"
- Upload that to test basic functionality

### For OpenAI Issues:

**Option 1: Skip it (for testing)**
```env
# backend/.env
OPENAI_API_KEY=
```
App works fine without it!

**Option 2: Verify key**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

---

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] `backend/.env` file exists with all variables
- [ ] `frontend/.env` file exists (already configured)
- [ ] Backend runs without errors
- [ ] Frontend compiles successfully
- [ ] MongoDB is accessible
- [ ] Health endpoint returns 200: `curl http://localhost:5000/health`
- [ ] Backend console shows "ResumeRAG Server Started Successfully"
- [ ] Frontend opens in browser at localhost:3000
- [ ] No console errors in browser (F12)

---

## 📞 Still Having Issues?

1. **Check the specific error message** in:
   - Backend terminal
   - Frontend terminal
   - Browser console (F12)

2. **Try the simplest case first:**
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev
   
   # New terminal - Frontend
   cd frontend
   npm install
   npm start
   ```

3. **Verify your files:**
   ```bash
   # Check .env exists
   Test-Path backend\.env
   Test-Path frontend\.env
   
   # Check content (be careful, contains secrets!)
   Get-Content backend\.env
   ```

4. **Clean install:**
   ```bash
   # Backend
   cd backend
   Remove-Item -Recurse node_modules
   Remove-Item package-lock.json
   npm install
   
   # Frontend
   cd frontend
   Remove-Item -Recurse node_modules
   Remove-Item package-lock.json
   npm install
   ```

---

## 🎯 Quick Fixes

### Everything is broken!
```bash
# Nuclear option - reinstall everything
cd backend
Remove-Item -Recurse node_modules
npm install

cd ../frontend
Remove-Item -Recurse node_modules
npm install

# Restart both servers
```

### Can't parse ANY files
```bash
cd backend
npm install pdf-parse@1.1.1 mammoth --save
npm run dev
```

### Frontend shows blank page
```bash
cd frontend
npm install axios
npm start
# Check browser console (F12) for errors
```

---

**Remember:** Most issues are due to:
1. Missing `.env` file
2. Services not running
3. Wrong ports or URLs
4. Missing dependencies

**Always check the error message first!** 🔍
