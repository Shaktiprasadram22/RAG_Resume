# ResumeRAG - AI-Powered Resume Intelligence Platform

<div align="center">

**Full-stack application for intelligent resume analysis, job matching, and candidate search using RAG (Retrieval-Augmented Generation)**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-orange.svg)](https://openai.com/)

</div>

---

## 🚀 Quick Start

```bash
# 1. Clone/navigate to the project
cd "RAG Resume"

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
npm run dev

# 3. Setup frontend (in new terminal)
cd frontend
npm install
npm start

# 4. Open browser
http://localhost:3000
```

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#️-setup-guide)
- [API Documentation](#-api-documentation)
- [Component Overview](#-component-overview)
- [Integration](#-integration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🎯 Core Features

1. **Smart Resume Parsing**
   - Upload PDF/DOCX resumes
   - Extract structured data (name, email, skills, education)
   - Generate embeddings for semantic search

2. **RAG-Powered Search**
   - Semantic search using OpenAI embeddings
   - Cosine similarity matching
   - Natural language job description queries

3. **Job Match Recommendations**
   - AI-driven candidate-job matching
   - Skill-based and semantic scoring
   - Bidirectional matching (jobs→candidates, candidates→jobs)

4. **AI Summary Generation**
   - Professional resume summaries
   - Job-specific tailored summaries
   - Cover letter generation

5. **Keyword Optimization**
   - ATS score calculation
   - Keyword gap analysis
   - Optimization suggestions

6. **Interactive Dashboard**
   - Real-time analytics
   - Top skills analysis
   - Submission trends
   - Education distribution

7. **RAG Chatbot**
   - Conversational AI interface
   - Natural language queries
   - Career advice
   - Interview question generation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Parsing  │  │  Search  │  │ Matching │  │ Dashboard│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                  │
│                    API Layer (Axios)                        │
└──────────────────────────┼──────────────────────────────────┘
                           │
                     HTTP/REST API
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    Backend (Express)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Routes & Middleware                      │  │
│  └────┬────────┬────────┬────────┬────────┬────────────┘  │
│       │        │        │        │        │                │
│  ┌────▼────┐┌──▼──┐┌───▼───┐┌───▼───┐┌───▼────┐          │
│  │ Parsing ││Search││Matching││Summary││Chatbot │          │
│  │ Module  ││Module││ Module ││Module ││ Module │          │
│  └────┬────┘└──┬──┘└───┬───┘└───┬───┘└───┬────┘          │
│       │        │        │        │        │                │
│       └────────┴────────┴────────┴────────┘                │
│                          │                                  │
│       ┌──────────────────┼──────────────────┐              │
│       │                  │                  │              │
│  ┌────▼─────┐      ┌────▼────┐      ┌─────▼────┐         │
│  │ MongoDB  │      │ OpenAI  │      │  Utils   │         │
│  │ Database │      │   API   │      │ Helpers  │         │
│  └──────────┘      └─────────┘      └──────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2.0 (JavaScript)
- **HTTP Client:** Axios 1.6.0
- **Styling:** Pure CSS (no frameworks)
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **AI/ML:** OpenAI API (GPT-3.5 Turbo, Text Embeddings)
- **File Processing:** Multer, pdf-parse, mammoth
- **Authentication:** JWT (placeholder)

### DevOps
- **Package Manager:** npm
- **Environment:** dotenv
- **Development:** nodemon
- **CORS:** cors middleware

## 📁 Project Structure

```
RAG Resume/
├── frontend/                          # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                # API integration layer
│   │   ├── components/
│   │   │   ├── SmartResumeParsing.jsx
│   │   │   ├── RAGSearch.jsx
│   │   │   ├── JobMatchRecommendation.jsx
│   │   │   ├── AISummaryGeneration.jsx
│   │   │   ├── KeywordOptimization.jsx
│   │   │   ├── InteractiveDashboard.jsx
│   │   │   └── RAGChatbot.jsx
│   │   ├── styles/
│   │   │   ├── variables.css        # Design tokens
│   │   │   ├── main.css             # Global styles
│   │   │   └── components.css       # Component styles
│   │   ├── App.js                   # Main app component
│   │   └── index.js                 # Entry point
│   ├── .env                          # Frontend environment
│   └── package.json
│
├── backend/                           # Node.js + Express API
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── openai.js                # OpenAI setup
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling
│   │   └── logger.js                # Request logging
│   ├── models/
│   │   ├── Resume.js                # Resume schema
│   │   └── Job.js                   # Job schema
│   ├── modules/
│   │   ├── SmartResumeParsing.js
│   │   ├── RAGSearch.js
│   │   ├── JobMatchRecommendation.js
│   │   ├── AISummaryGeneration.js
│   │   ├── KeywordOptimization.js
│   │   ├── InteractiveDashboard.js
│   │   └── RAGChatbot.js
│   ├── routes/
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── chatbotRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── embeddingHelper.js       # Embeddings & similarity
│   │   ├── parseUtils.js            # File parsing
│   │   └── responseHelper.js        # Response formatting
│   ├── index.js                     # Server entry point
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── SETUP_GUIDE.md                    # Complete setup instructions
├── INTEGRATION_GUIDE.md              # Integration testing guide
└── README.md                         # This file
```

## ⚙️ Setup Guide

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [Atlas](https://www.mongodb.com/cloud/atlas))
- OpenAI API Key ([Get Key](https://platform.openai.com/api-keys)) - Optional

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resumerag
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-here
CORS_ORIGINS=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will open at `http://localhost:3000`

### Verification

Backend health check:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "ResumeRAG API is running"
}
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Resume Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/upload` | Upload and parse resume |
| GET | `/resume` | Get all resumes |
| GET | `/resume/:id` | Get resume by ID |
| POST | `/resume/search` | Search resumes (RAG) |
| POST | `/resume/:id/generate-summary` | Generate AI summary |
| POST | `/resume/:id/optimize-keywords` | Keyword analysis |

#### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobs` | Create job posting |
| GET | `/jobs` | Get all jobs |
| POST | `/jobs/:id/find-candidates` | Find matching candidates |
| POST | `/jobs/recommend` | Get job recommendations |

#### Chatbot Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chatbot/message` | Send chat message |
| POST | `/chatbot/search` | Natural language search |
| GET | `/chatbot/greeting` | Get greeting message |

#### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/dashboard/top-skills` | Top skills analysis |
| GET | `/dashboard/analytics` | Comprehensive analytics |

See detailed API documentation in `backend/README.md`

## 🎨 Component Overview

### 1. SmartResumeParsing
- File upload with drag-and-drop support
- PDF/DOCX parsing
- Real-time text preview
- Structured data extraction

### 2. RAGSearch
- Natural language job description input
- Semantic search with embeddings
- Result cards with match scores
- Skills highlighting

### 3. JobMatchRecommendation
- Resume selection dropdown
- Top job recommendations
- Match percentage visualization
- Skill overlap analysis

### 4. AISummaryGeneration
- Resume selection
- AI-powered summary generation
- Copy to clipboard
- Edit capabilities

### 5. KeywordOptimization
- Job description vs resume analysis
- ATS score calculation
- Matched/missing keywords
- Optimization suggestions

### 6. InteractiveDashboard
- Statistics cards
- Top skills visualization
- Trend charts (placeholder)
- Real-time data

### 7. RAGChatbot
- Conversational interface
- Context-aware responses
- Natural language understanding
- Career advice

## 🔗 Integration

### Frontend → Backend Flow

```javascript
// Frontend component
import { uploadResume } from '../api/api';

const handleUpload = async (file) => {
  const response = await uploadResume(file);
  // Handle response
};

// API layer (src/api/api.js)
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/api/resume/upload', formData);
  return response.data;
};

// Backend route
router.post('/upload', upload.single('resume'), async (req, res) => {
  const parsedData = await parseResume(req.file.buffer, ...);
  // Return response
});
```

### Environment Variables

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumerag
OPENAI_API_KEY=sk-...
JWT_SECRET=...
CORS_ORIGINS=http://localhost:3000
```

## 🧪 Testing

### Manual Testing

1. **Upload Resume:**
   - Navigate to Smart Resume Parsing
   - Upload a PDF/DOCX file
   - Verify parsed data appears

2. **Search Resumes:**
   - Enter job description in RAG Search
   - Verify results with match scores

3. **Get Recommendations:**
   - Select a resume in Job Match
   - Verify job recommendations appear

See `INTEGRATION_GUIDE.md` for complete testing instructions.

### API Testing

```bash
# Health check
curl http://localhost:5000/health

# Upload resume
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@resume.pdf"

# Search resumes
curl -X POST http://localhost:5000/api/resume/search \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "React developer", "limit": 10}'
```

## 🚀 Deployment

### Backend Deployment

**Recommended Platforms:**
- Heroku
- Railway
- Render
- AWS EC2

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:** Set all variables from `.env.example`

### Frontend Deployment

**Recommended Platforms:**
- Vercel
- Netlify
- AWS S3 + CloudFront

**Build Command:**
```bash
npm run build
```

**Environment Variables:**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 🎯 Features in Detail

### RAG Implementation

The application uses Retrieval-Augmented Generation (RAG) for intelligent resume matching:

1. **Embedding Generation:** Resumes and job descriptions are converted to vector embeddings using OpenAI's text-embedding-ada-002 model

2. **Similarity Search:** Cosine similarity is calculated between job description embeddings and resume embeddings

3. **Ranking:** Results are ranked by similarity score and presented with match percentages

4. **Context Enhancement:** Chat responses use retrieved resume context for accurate answers

### OpenAI Integration

- **Embeddings:** `text-embedding-ada-002` (1536 dimensions)
- **Chat:** `gpt-3.5-turbo` for summaries and chatbot
- **Fallback:** System works without OpenAI key (demo mode)

### Database Schema

**Resume:**
```javascript
{
  filename: String,
  name: String,
  email: String,
  skills: [String],
  education: [String],
  rawText: String,
  embedding: [Number], // 1536-dimensional vector
  uploadedAt: Date
}
```

**Job:**
```javascript
{
  title: String,
  company: String,
  description: String,
  requiredSkills: [String],
  embedding: [Number],
  status: String, // 'active', 'closed', 'draft'
  postedAt: Date
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- OpenAI for embeddings and chat APIs
- MongoDB for database
- React community for excellent documentation
- Express.js for robust backend framework

## 📞 Support

For issues or questions:
- Check `SETUP_GUIDE.md` for setup help
- Check `INTEGRATION_GUIDE.md` for testing help
- Review backend and frontend README files
- Open an issue on GitHub

---

<div align="center">

**Built with ❤️ using React, Node.js, MongoDB, and OpenAI**

</div>
