import React, { useState, useEffect } from 'react';
import { getAllResumes, getJobRecommendations } from '../api/api';
import { useAuth } from '../context/AuthContext';
/**
 * JobMatchRecommendation Component
 * Display best-fit job recommendations with match percentage
 */
const JobMatchRecommendation = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [error, setError] = useState(null);

  const loadResumes = async () => {
    try {
      const params = { limit: 20 };
      if (user) {
        params.userId = user.id;
        params.userRole = user.role;
      }
      const response = await getAllResumes(params);
      if (response.success) {
        setResumes(response.data.resumes || []);
        if (response.data.resumes && response.data.resumes.length > 0) {
          setSelectedResumeId(response.data.resumes[0]._id);
          fetchRecommendations(response.data.resumes[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading resumes:', err);
    }
  };

  const fetchRecommendations = async (resumeId) => {
    if (!resumeId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await getJobRecommendations(resumeId, 5);
      if (response.success && response.data.recommendations) {
        setJobMatches(response.data.recommendations.map(rec => ({
          id: rec.jobId,
          title: rec.jobTitle,
          company: rec.company || 'Company',
          location: 'Remote',
          matchPercentage: rec.matchScore,
          salary: '$100k - $140k',
          type: 'Full-time'
        })));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to load recommendations');
      // Fallback to mock data
      setJobMatches([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      matchPercentage: 95,
      salary: '$120k - $160k',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      matchPercentage: 88,
      salary: '$100k - $140k',
      type: 'Full-time'
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'Digital Agency Co.',
      location: 'New York, NY',
      matchPercentage: 82,
      salary: '$90k - $120k',
      type: 'Full-time'
    },
    {
      id: 4,
      title: 'JavaScript Developer',
      company: 'Web Solutions Inc.',
      location: 'Austin, TX',
      matchPercentage: 78,
      salary: '$85k - $110k',
      type: 'Contract'
    },
    {
      id: 5,
      title: 'UI/UX Developer',
      company: 'Creative Studio',
      location: 'Los Angeles, CA',
      matchPercentage: 72,
      salary: '$80k - $105k',
      type: 'Full-time'
    }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [user]);

  const handleRefresh = () => {
    if (selectedResumeId) {
      fetchRecommendations(selectedResumeId);
    }
  };

  // Get match color based on percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'var(--color-success)';
    if (percentage >= 75) return 'var(--color-primary)';
    if (percentage >= 60) return 'var(--color-warning)';
    return 'var(--color-text-muted)';
  };

  return (
    <section id="job-match" className="section">
      <div className="section-header">
        <h2 className="section-title">Job Match Recommendations</h2>
        <p className="section-subtitle">AI-powered job recommendations based on your resume</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🎯</div>
          <div>
            <h3 className="card-title">Best Job Matches</h3>
          </div>
        </div>

        <div className="card-body">
          {/* Resume Selection */}
          {resumes.length > 0 && (
            <div className="input-group">
              <label className="input-label">Select Resume</label>
              <select
                className="select"
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  fetchRecommendations(e.target.value);
                }}
              >
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.name} - {resume.skills.slice(0, 3).join(', ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              ❌ {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)' }}>⏳</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>Loading recommendations...</div>
            </div>
          )}

          {/* Job Matches */}
          {!loading && jobMatches.length > 0 && jobMatches.map((job) => (
            <div key={job.id} className="match-item">
              {/* Job Info Header */}
              <div className="match-header">
                <div>
                  <div className="match-label">{job.title}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {job.company} • {job.location}
                  </div>
                </div>
                <div className="match-percentage" style={{ color: getMatchColor(job.matchPercentage) }}>
                  {job.matchPercentage}%
                </div>
              </div>

              {/* Match Bar */}
              <div className="match-bar-container">
                <div 
                  className="match-bar" 
                  style={{ 
                    width: `${job.matchPercentage}%`,
                    background: `linear-gradient(90deg, ${getMatchColor(job.matchPercentage)}, ${getMatchColor(job.matchPercentage)}dd)`
                  }}
                />
              </div>

              {/* Job Details */}
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                <span className="badge badge-primary">{job.type}</span>
                <span className="badge badge-success">{job.salary}</span>
              </div>
            </div>
          ))}

          {/* No Results */}
          {!loading && jobMatches.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <div className="empty-state-text">No job recommendations available</div>
            </div>
          )}

          {/* Action Button */}
          {jobMatches.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
                {loading ? '⏳ Loading...' : '🔄 Refresh Recommendations'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobMatchRecommendation;
