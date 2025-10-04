import React, { useState, useEffect } from 'react';
import { getAllResumes, generateResumeSummary } from '../api/api';

/**
 * AISummaryGeneration Component
 * Generate AI-powered summaries for resumes
 */
const AISummaryGeneration = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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

  // Handle summary generation
  const handleGenerate = async (event) => {
    event.preventDefault();
    
    if (!selectedResume) {
      setError('Please select a resume first!');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateResumeSummary(selectedResume);
      if (response.success) {
        setGeneratedSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
      // Fallback summary
      setGeneratedSummary('Professional summary: Skilled candidate with relevant experience and expertise in the required technologies.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSummary);
    alert('Summary copied to clipboard!');
  };

  return (
    <section id="ai-summary" className="section">
      <div className="section-header">
        <h2 className="section-title">AI Summary Generation</h2>
        <p className="section-subtitle">Generate professional summaries for resumes using AI</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">✨</div>
          <div>
            <h3 className="card-title">Create AI-Powered Summary</h3>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleGenerate}>
            {/* Resume Selection */}
            <div className="input-group">
              <label className="input-label">Select Resume</label>
              <select
                className="select"
                value={selectedResume}
                onChange={(e) => {
                  setSelectedResume(e.target.value);
                  setGeneratedSummary('');
                  setError(null);
                }}
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.name} - {resume.skills.slice(0, 2).join(', ')}
                  </option>
                ))}
              </select>
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

            {/* Generate Button */}
            <button type="submit" className="btn btn-primary" disabled={isGenerating || !selectedResume}>
              {isGenerating ? '⏳ Generating...' : '✨ Generate Summary'}
            </button>
          </form>

          {/* Generated Summary Display */}
          {generatedSummary && (
            <div className="mt-2">
              <div className="input-group">
                <label className="input-label">Generated Summary</label>
                <textarea
                  className="textarea"
                  value={generatedSummary}
                  onChange={(e) => setGeneratedSummary(e.target.value)}
                  rows="6"
                  placeholder="AI-generated summary will appear here..."
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <button className="btn btn-success" onClick={handleCopy}>
                  📋 Copy to Clipboard
                </button>
                <button className="btn btn-secondary" onClick={() => setGeneratedSummary('')}>
                  🔄 Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AISummaryGeneration;
