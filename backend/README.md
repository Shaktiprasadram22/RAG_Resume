# ResumeRAG Backend API

AI-powered resume intelligence backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Smart Resume Parsing** - Extract structured data from PDF/DOCX files
- **RAG-Powered Search** - Semantic search using embeddings and cosine similarity
- **Job Matching** - AI-driven candidate-job matching
- **AI Summary Generation** - OpenAI-powered resume summaries
- **Keyword Optimization** - ATS score calculation and keyword analysis
- **Interactive Dashboard** - Analytics and statistics
- **RAG Chatbot** - Conversational interface for resume queries

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── openai.js                # OpenAI API setup
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── errorHandler.js          # Error handling
│   └── logger.js                # Request logging
├── models/
│   ├── Resume.js                # Resume schema
│   └── Job.js                   # Job schema
├── modules/
│   ├── SmartResumeParsing.js    # Resume parsing logic
│   ├── RAGSearch.js             # Semantic search
│   ├── JobMatchRecommendation.js # Job matching
│   ├── AISummaryGeneration.js   # AI summaries
│   ├── KeywordOptimization.js   # Keyword analysis
│   ├── InteractiveDashboard.js  # Analytics
│   └── RAGChatbot.js            # Chatbot logic
├── routes/
│   ├── resumeRoutes.js          # Resume endpoints
│   ├── jobRoutes.js             # Job endpoints
│   ├── chatbotRoutes.js         # Chatbot endpoints
│   └── dashboardRoutes.js       # Dashboard endpoints
├── utils/
│   ├── embeddingHelper.js       # Embedding & similarity
│   ├── parseUtils.js            # Text extraction
│   └── responseHelper.js        # Response formatting
├── index.js                     # Express server
├── package.json
└── .env.example
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (optional, for AI features)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumerag
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=http://localhost:3000
```

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

5. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

6. **Verify server is running:**
```bash
curl http://localhost:5000/health
```

## 📚 API Endpoints

### Resume Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload and parse resume |
| GET | `/api/resume` | Get all resumes |
| GET | `/api/resume/:id` | Get resume by ID |
| POST | `/api/resume/search` | Search resumes by job description |
| POST | `/api/resume/search-by-skills` | Search by skills |
| POST | `/api/resume/:id/generate-summary` | Generate AI summary |
| POST | `/api/resume/:id/optimize-keywords` | Analyze keywords |
| DELETE | `/api/resume/:id` | Delete resume |

### Job Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job posting |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get job by ID |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/jobs/:id/find-candidates` | Find matching candidates |
| POST | `/api/jobs/recommend` | Get job recommendations |

### Chatbot Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/message` | Send chat message |
| POST | `/api/chatbot/search` | Natural language resume search |
| POST | `/api/chatbot/resume-question` | Ask about specific resume |
| POST | `/api/chatbot/career-advice` | Get career advice |
| POST | `/api/chatbot/interview-questions` | Generate interview questions |
| GET | `/api/chatbot/greeting` | Get greeting message |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Overview statistics |
| GET | `/api/dashboard/top-skills` | Top skills analysis |
| GET | `/api/dashboard/submission-trend` | Submission trends |
| GET | `/api/dashboard/job-stats` | Job statistics |
| GET | `/api/dashboard/analytics` | Comprehensive analytics |

## 🔍 Usage Examples

### Upload Resume

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@/path/to/resume.pdf"
```

### Search Resumes

```bash
curl -X POST http://localhost:5000/api/resume/search \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Looking for a React developer with 3+ years experience",
    "limit": 10
  }'
```

### Create Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "description": "We are looking for an experienced React developer...",
    "requiredSkills": ["React", "JavaScript", "Node.js"],
    "experienceLevel": "senior",
    "type": "full-time"
  }'
```

### Chat with Bot

```bash
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find me candidates with Python skills",
    "conversationHistory": []
  }'
```

## 🧪 Testing

Test the health endpoint:
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

## 🔐 Security Notes

- JWT authentication is placeholder implementation
- Set strong `JWT_SECRET` in production
- Keep `OPENAI_API_KEY` secure
- Use HTTPS in production
- Implement rate limiting for production
- Validate and sanitize all user inputs

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction
- **openai** - OpenAI API client
- **jsonwebtoken** - JWT authentication
- **morgan** - HTTP request logger

## 🚧 Development

### Run with hot reload:
```bash
npm run dev
```

### Check logs:
Server logs will show all incoming requests and responses.

## 🌟 Features in Detail

### Smart Resume Parsing
- Supports PDF and DOCX formats
- Extracts: name, email, phone, skills, education
- Generates embeddings for semantic search
- Max file size: 10MB

### RAG Search
- Uses OpenAI embeddings (text-embedding-ada-002)
- Cosine similarity matching
- Fallback to dummy embeddings if API not configured
- Supports advanced filtering

### Job Matching
- Combined skill-based and semantic matching
- Weighted scoring algorithm
- Match explanations
- Bidirectional matching (candidates→jobs, jobs→candidates)

### AI Summary
- Powered by GPT-3.5-turbo
- Professional resume summaries
- Job-specific tailored summaries
- Cover letter generation

### Keyword Optimization
- ATS score calculation
- Keyword gap analysis
- Optimization suggestions
- Placement recommendations

## 📄 License

ISC

---

Built with ❤️ using Node.js, Express, and MongoDB
