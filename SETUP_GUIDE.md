# ResumeRAG - Complete Setup Guide

Simple guide to get ResumeRAG running on your local machine.

---

## 📋 What You Need

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** (Free) - [Sign Up](https://www.mongodb.com/cloud/atlas)
- **OpenAI API Key** (Optional) - [Get Key](https://platform.openai.com/api-keys)

## 🗂️ Project Structure

```
RAG Resume/
{{ ... }}
├── frontend/                    # React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # 7 feature components
│   │   ├── styles/             # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── backend/                     # Node.js + Express API
    ├── config/                  # DB & OpenAI config
    ├── middleware/              # Auth, logger, error handler
    ├── models/                  # Mongoose schemas
    ├── modules/                 # 7 feature modules
    ├── routes/                  # API routes
    ├── utils/                   # Helper functions
    ├── index.js                 # Server entry point
    └── package.json
```

## 🚀 Quick Start

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# (See Backend Configuration section below)

# Start MongoDB (if using local installation)
mongod

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### Step 2: Setup Frontend

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will open automatically at: **http://localhost:3000**

## ⚙️ Backend Configuration

Edit `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development


# OpenAI Configuration (optional)
OPENAI_API_KEY=sk-your-openai-api-key-here

# JWT Secret
JWT_SECRET=your-secret-key-here-change-in-production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### MongoDB Setup Options

#### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Verify it's running
mongo --eval "db.version()"
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### OpenAI API Setup (Optional)

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Go to API Keys section
3. Create new secret key
4. Add to `.env` as `OPENAI_API_KEY`

**Note:** If OpenAI key is not configured, the system will use fallback dummy data for AI features.

## 🧪 Testing the Setup

### Test Backend

1. **Health Check:**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "ResumeRAG API is running",
  "timestamp": "2025-10-04T08:19:39.000Z",
  "environment": "development"
}
```

2. **Get Dashboard Stats:**
```bash
curl http://localhost:5000/api/dashboard/mock
```

3. **Upload a Resume (using Postman or curl):**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@/path/to/your/resume.pdf"
```

### Test Frontend

1. Open browser to http://localhost:3000
2. You should see the ResumeRAG interface with all 7 components
3. Try interacting with different sections:
   - Upload a resume
   - Search for resumes
   - View job recommendations
   - Use the chatbot

## 📡 API Endpoints

### Resume Endpoints
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume` - Get all resumes
- `POST /api/resume/search` - Search resumes
- `POST /api/resume/:id/generate-summary` - Generate AI summary
- `POST /api/resume/:id/optimize-keywords` - Keyword analysis

### Job Endpoints
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/recommend` - Get recommendations
- `POST /api/jobs/:id/find-candidates` - Find candidates

### Chatbot Endpoints
- `POST /api/chatbot/message` - Chat message
- `POST /api/chatbot/search` - Natural language search
- `POST /api/chatbot/career-advice` - Get advice

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Overview stats
- `GET /api/dashboard/top-skills` - Top skills
- `GET /api/dashboard/analytics` - Full analytics

## 🔧 Common Issues & Solutions

### Backend won't start

**Issue:** MongoDB connection error
```
Solution: 
1. Ensure MongoDB is running (run 'mongod')
2. Check MONGODB_URI in .env
3. Verify MongoDB port (default: 27017)
```

**Issue:** Port 5000 already in use
```
Solution: 
1. Change PORT in .env to another port (e.g., 5001)
2. Or kill process using port 5000
```

### Frontend won't start

**Issue:** Port 3000 already in use
```
Solution:
1. Choose 'Y' to run on different port when prompted
2. Or kill process using port 3000
```

**Issue:** API calls failing (CORS error)
```
Solution:
1. Ensure backend is running
2. Check CORS_ORIGINS in backend .env includes frontend URL
```

### File Upload Issues

**Issue:** File upload fails
```
Solution:
1. Check file size (max 10MB)
2. Ensure file format is PDF or DOCX
3. Check backend logs for errors
```

### OpenAI Features Not Working

**Issue:** AI features return errors
```
Solution:
1. Verify OPENAI_API_KEY is set correctly
2. Check OpenAI account has credits
3. System will use fallback data if key is not configured
```

## 🌐 Connecting Frontend to Backend

The frontend is pre-configured to connect to `http://localhost:5000`. If you change the backend port, update API calls in frontend components.

Example:
```javascript
// In frontend component
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 📦 Production Deployment

### Backend Deployment

**Recommended platforms:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

**Pre-deployment checklist:**
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas for database
4. Set proper CORS origins
5. Enable HTTPS
6. Add rate limiting
7. Set up monitoring

### Frontend Deployment

**Recommended platforms:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Build for production:**
```bash
cd frontend
npm run build
```

## 📚 Additional Resources

### Backend Documentation
- See `backend/README.md` for detailed API documentation
- All modules are well-commented with JSDoc

### Frontend Documentation
- See `frontend/README.md` for component details
- CSS architecture documented in style files

## 🛠️ Development Tips

### Running Both Servers Simultaneously

**Option 1: Using two terminals**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

**Option 2: Using concurrently (optional)**
Install at root:
```bash
npm install -g concurrently
```

Create root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

Run both:
```bash
npm run dev
```

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Changes auto-refresh browser
- **Backend:** Uses nodemon to restart on file changes

## 🔒 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Validate all inputs** - Middleware in place
4. **Use HTTPS in production**
5. **Implement rate limiting** - Add express-rate-limit
6. **Keep dependencies updated** - Run `npm audit`

## 📊 Monitoring & Logs

### Backend Logs
- Request/response logs printed to console
- Error logs include stack traces in development
- Use Morgan for HTTP logging

### Frontend Logs
- Check browser console for errors
- React DevTools for component debugging

## 🎉 You're All Set!

Your ResumeRAG application should now be running:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API Health:** http://localhost:5000/health

Start uploading resumes and exploring the AI-powered features!

## 💡 Next Steps

1. **Seed sample data:** Upload some test resumes and create job postings
2. **Explore features:** Try each component (resume parsing, search, matching, etc.)
3. **Customize:** Modify components and styles to fit your needs
4. **Deploy:** Follow production deployment guide above
5. **Extend:** Add authentication, more AI features, or additional modules

## 📞 Support

For issues or questions:
- Check the README files in frontend/ and backend/
- Review error logs in terminal
- Verify all environment variables are set correctly

---

Happy coding! 🚀
