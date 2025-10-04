# ResumeRAG Frontend

AI-Powered Resume Analysis Platform built with React

## 🚀 Features

- **Smart Resume Parsing** - Upload and parse resumes (PDF/DOCX)
- **RAG-Powered Search** - Intelligent resume search using job descriptions
- **Job Match Recommendations** - AI-driven job matching with percentage scores
- **AI Summary Generation** - Generate professional resume summaries
- **Keyword Optimization** - Analyze and optimize resume keywords
- **Interactive Dashboard** - Real-time analytics and insights
- **RAG Chatbot** - Interactive chat for resume queries

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SmartResumeParsing.jsx
│   │   ├── RAGSearch.jsx
│   │   ├── JobMatchRecommendation.jsx
│   │   ├── AISummaryGeneration.jsx
│   │   ├── KeywordOptimization.jsx
│   │   ├── InteractiveDashboard.jsx
│   │   └── RAGChatbot.jsx
│   ├── styles/
│   │   ├── variables.css
│   │   ├── main.css
│   │   └── components.css
│   ├── App.js
│   └── index.js
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## 🎨 Design Theme

- **Color Palette:**
  - Background: #f8fafc
  - Primary: #3b82f6
  - Text: #1e293b
  - Accent: Navy blue with modern gradients

- **Typography:** Inter font family
- **Style:** Professional corporate/tech startup vibe

## 📦 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔧 Technologies Used

- React 18
- CSS3 (no Tailwind/inline styles)
- Modern ES6+ JavaScript
- Functional Components with Hooks

## 📝 Notes

- All components are currently using mock data
- Connect to backend APIs to enable full functionality
- Chart placeholders in Dashboard - integrate libraries like Chart.js or Recharts
- File upload functionality needs backend integration

## 🚀 Next Steps

1. Connect to backend API endpoints
2. Implement actual file upload/parsing logic
3. Add chart libraries for dashboard
4. Integrate real RAG/AI services
5. Add authentication/authorization
6. Implement state management (Context API/Redux)

---

Built with ❤️ using React
