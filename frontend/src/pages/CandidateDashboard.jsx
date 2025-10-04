import React, { useState } from 'react';
import KeywordOptimization from '../components/KeywordOptimization';
import AISummaryGeneration from '../components/AISummaryGeneration';
import RAGChatbot from '../components/RAGChatbot';
import '../styles/dashboard.css';

const CandidateDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'keyword-optimization',
      title: 'ATS Optimization Helper',
      description: 'Optimize your resume for Applicant Tracking Systems and get higher match scores',
      icon: '📊',
      component: KeywordOptimization
    },
    {
      id: 'ai-summary',
      title: 'AI Resume Summary',
      description: 'Generate professional summaries and cover letters tailored to job descriptions',
      icon: '✨',
      component: AISummaryGeneration
    },
    {
      id: 'chatbot',
      title: 'Career Coach Chatbot',
      description: 'Get career advice, resume tips, and interview preparation guidance',
      icon: '💬',
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
            <h1>Job Seeker Dashboard</h1>
            <p>Tools to help you land your dream job</p>
          </div>

          <div className="feature-grid candidate-grid">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="feature-card"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-button">
                  Launch Tool →
                </button>
              </div>
            ))}
          </div>

          <div className="tips-section">
            <h3>💡 Quick Tips for Job Seekers</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <strong>Optimize Your Resume</strong>
                <p>Use our ATS helper to match keywords from job descriptions</p>
              </div>
              <div className="tip-card">
                <strong>Craft Compelling Summaries</strong>
                <p>Let AI generate professional summaries that highlight your strengths</p>
              </div>
              <div className="tip-card">
                <strong>Get Expert Guidance</strong>
                <p>Chat with our AI career coach for personalized advice</p>
              </div>
            </div>
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

export default CandidateDashboard;
