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
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <div>
                      <h5 className="result-title">{result.name}</h5>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                        {result.title}
                      </p>
                    </div>
                    <div className="result-score">{result.score}% Match</div>
                  </div>
                  <p className="result-description">{result.description}</p>
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    {result.skills.map((skill, index) => (
                      <span key={index} className="badge badge-primary">
                        {skill}
                      </span>
                    ))}
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
