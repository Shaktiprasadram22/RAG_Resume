import React, { useState } from 'react';
import { searchResumes } from '../api/api';

/**
 * RAGSearch Component
 * Search for matching resumes based on job description using RAG
 */
const RAGSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Handle search
  const handleSearch = async (event) => {
    event.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Call backend API for RAG search
      const response = await searchResumes(searchQuery, 10);
      
      if (response.success) {
        setResults(response.data.results || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search resumes. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="rag-search" className="section">
      <div className="section-header">
        <h2 className="section-title">RAG-Powered Search</h2>
        <p className="section-subtitle">Find the best matching resumes for your job description</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🔍</div>
          <div>
            <h3 className="card-title">Intelligent Resume Search</h3>
          </div>
        </div>

        <div className="card-body">
          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <label className="input-label">Job Description / Requirements</label>
              <textarea
                className="textarea"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter job description or key requirements (e.g., 'Looking for a React developer with 3+ years of experience...')"
                rows="4"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSearching}>
              {isSearching ? '🔄 Searching...' : '🔍 Search Resumes'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-2" style={{ 
              padding: 'var(--spacing-md)', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <div className="mt-2">
              <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>
                Found {results.length} matching candidates
              </h4>
              {results.map((result) => (
                <div key={result.id || result._id} className="result-card" style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1.5rem', 
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {/* Header with Match Score */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid #667eea' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1a202c' }}>
                      📄 CV: {result.filename || 'Resume'}
                    </h3>
                    <span style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#10b981', 
                      color: 'white', 
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      {result.matchScore}% Match
                    </span>
                  </div>

                  {/* Simple CV Data Display */}
                  <div style={{ lineHeight: '1.8' }}>
                    <p><strong>Name:</strong> {result.name}</p>
                    <p><strong>Email:</strong> {result.email}</p>
                    <p><strong>Phone:</strong> {result.phone}</p>
                    <p><strong>Uploaded By:</strong> {result.uploaderName} ({result.uploaderEmail})</p>
                    
                    {result.skills && result.skills.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Skills:</strong>
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {result.skills.map((skill, idx) => (
                            <span key={idx} style={{
                              padding: '0.25rem 0.75rem',
                              background: '#667eea',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.education && result.education.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Education:</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                          {result.education.map((edu, idx) => (
                            <li key={idx}>{edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {results.length === 0 && searchQuery && !isSearching && (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No results found</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RAGSearch;
