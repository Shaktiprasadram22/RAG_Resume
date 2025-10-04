import React, { useState, useEffect } from 'react';
import { getAllResumes, optimizeKeywords } from '../api/api';

/**
 * KeywordOptimization Component
 * Analyze resume against job description and suggest missing keywords
 */
const KeywordOptimization = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Load resumes on mount
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await getAllResumes({ limit: 20 });
      if (response.success) {
        setResumes(response.data.resumes || []);
      }
    } catch (err) {
      console.error('Error loading resumes:', err);
    }
  };

  // Handle analysis
  const handleAnalyze = async (event) => {
    event.preventDefault();
    
    if (!selectedResumeId) {
      setError('Please select a resume');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await optimizeKeywords(selectedResumeId, jobDescription);
      
      if (response.success) {
        setAnalysis({
          ...response.data.analysis,
          suggestions: response.data.suggestions,
          atsScore: response.data.atsScore
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze keywords. Please try again.');
      // Fallback to mock data
      setAnalysis({
        matchedKeywords: ['React', 'JavaScript', 'Agile', 'Git'],
        missingKeywords: ['TypeScript', 'Redux', 'Testing'],
        suggestions: ['Add relevant keywords from the job description to your resume'],
        matchScore: 65,
        atsScore: { overallScore: 65, grade: 'C' }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="keyword-optimization" className="section">
      <div className="section-header">
        <h2 className="section-title">Keyword Optimization</h2>
        <p className="section-subtitle">Optimize your resume with AI-powered keyword analysis</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🔑</div>
          <div>
            <h3 className="card-title">Resume Keyword Analyzer</h3>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleAnalyze}>
            {/* Resume Selection */}
            <div className="input-group">
              <label className="input-label">Select Resume</label>
              <select
                className="select"
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setAnalysis(null);
                  setError(null);
                }}
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.name} - {resume.skills.slice(0, 3).join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Description Input */}
            <div className="input-group">
              <label className="input-label">Job Description</label>
              <textarea
                className="textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows="5"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                padding: 'var(--spacing-md)', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--color-error)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-error)',
                marginBottom: 'var(--spacing-md)'
              }}>
                ❌ {error}
              </div>
            )}

            {/* Analyze Button */}
            <button type="submit" className="btn btn-primary" disabled={isAnalyzing || !selectedResumeId}>
              {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Keywords'}
            </button>
          </form>

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-2">
              {/* Match Score */}
              <div style={{ 
                background: 'var(--color-surface-hover)', 
                padding: 'var(--spacing-lg)', 
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                  {analysis.matchScore}%
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Keyword Match Score
                </div>
                {analysis.atsScore && (
                  <div style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                    ATS Score: <strong>{analysis.atsScore.overallScore}%</strong> (Grade: {analysis.atsScore.grade})
                  </div>
                )}
              </div>

              {/* Matched Keywords */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-success)' }}>
                  ✓ Matched Keywords ({analysis.matchedKeywords.length})
                </h4>
                <div className="keyword-grid">
                  {analysis.matchedKeywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag suggested">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-warning)' }}>
                  ⚠ Missing Keywords ({analysis.missingKeywords.length})
                </h4>
                <div className="keyword-grid">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag missing">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 style={{ marginBottom: 'var(--spacing-md)' }}>💡 Optimization Suggestions</h4>
                <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-lg)' }}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} style={{ 
                      padding: 'var(--spacing-sm) 0',
                      borderBottom: index < analysis.suggestions.length - 1 ? '1px solid var(--color-border)' : 'none'
                    }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {index + 1}. {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeywordOptimization;
