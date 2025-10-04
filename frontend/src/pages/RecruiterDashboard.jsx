import React, { useState } from 'react';
import SmartResumeParsing from '../components/SmartResumeParsing';
import RAGSearch from '../components/RAGSearch';
import JobMatchRecommendation from '../components/JobMatchRecommendation';
import AISummaryGeneration from '../components/AISummaryGeneration';
import KeywordOptimization from '../components/KeywordOptimization';
import RAGChatbot from '../components/RAGChatbot';
import '../styles/dashboard.css';

const RecruiterDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'resume-parsing',
      title: 'Smart Resume Parsing',
      description: 'Upload and parse PDF/DOCX resumes with AI-powered extraction',
      component: SmartResumeParsing
    },
    {
      id: 'rag-search',
      title: 'RAG-based Semantic Search',
      description: 'Find the best candidates using natural language job descriptions',
      component: RAGSearch
    },
    {
      id: 'job-match',
      title: 'Job Match Recommendation',
      description: 'Get AI-powered candidate recommendations for your job postings',
      component: JobMatchRecommendation
    },
    {
      id: 'ai-summary',
      title: 'AI Summary Generation',
      description: 'Generate professional summaries for candidate profiles',
      component: AISummaryGeneration
    },
    {
      id: 'keyword-optimization',
      title: 'ATS & Keyword Helper',
      description: 'Analyze resume-job match and calculate ATS scores',
      component: KeywordOptimization
    },
    {
      id: 'chatbot',
      title: 'RAG Chatbot',
      description: 'AI assistant for recruitment queries and insights',
      component: RAGChatbot
    }
  ];

  const ActiveComponent = activeFeature 
    ? features.find(f => f.id === activeFeature)?.component 
    : null;

  return (
    <div className="dashboard-container">
      {!activeFeature ? (
        <>
          <div className="dashboard-header">
            <h1>Recruiter Dashboard</h1>
            <p>Access all your recruitment tools in one place</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="feature-card"
                onClick={() => setActiveFeature(feature.id)}
              >
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-button">
                  Open Tool →
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="feature-view">
          <button 
            className="back-button"
            onClick={() => setActiveFeature(null)}
          >
            ← Back to Dashboard
          </button>
          <div className="feature-content">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
