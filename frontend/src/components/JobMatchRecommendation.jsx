import React, { useState, useEffect } from 'react';
import { getAllResumes, getJobRecommendations, getAllJobs, deleteResume } from '../api/api';
import { useAuth } from '../context/AuthContext';
/**
 * JobMatchRecommendation Component
 * Display best-fit job recommendations with match percentage
 */
const JobMatchRecommendation = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [roleSuggestions, setRoleSuggestions] = useState([]);
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
          const firstResume = response.data.resumes[0];
          setSelectedResumeId(firstResume._id);
          setSelectedResume(firstResume);
          // Fetch role suggestions from actual jobs
          suggestRolesFromJobs(firstResume).then(suggestions => {
            setRoleSuggestions(suggestions);
          });
          fetchRecommendations(firstResume._id);
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
      if (response.success && response.data.recommendations && response.data.recommendations.length > 0) {
        setJobMatches(response.data.recommendations.map(rec => ({
          id: rec.jobId,
          title: rec.jobTitle,
          company: rec.company || 'Company',
          location: rec.location || 'Remote',
          matchPercentage: rec.matchScore,
          salary: rec.salary || 'Competitive',
          type: rec.type || 'Full-time'
        })));
      } else {
        // No jobs found in database
        setJobMatches([]);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to load job recommendations. Please try again.');
      setJobMatches([]);
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

  // AI-powered role suggestion based on CV skills (always works, no database needed)
  const suggestRolesFromSkills = (resume) => {
    if (!resume || !resume.skills || resume.skills.length === 0) return [];

    const skills = resume.skills.map(s => s.toLowerCase());
    const suggestions = [];
    
    // Experience level based on skills count
    const experienceLevel = skills.length < 5 ? 'Fresher' : 
                           skills.length < 10 ? 'Junior' : 
                           skills.length < 15 ? 'Mid-Level' : 'Senior';

    // ML & AI Roles
    const mlAiSkills = ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning', 
                        'tensorflow', 'pytorch', 'keras', 'neural networks', 'nlp', 'computer vision', 'scikit'];
    const mlCount = skills.filter(s => mlAiSkills.some(ml => s.includes(ml))).length;
    if (mlCount > 0) {
      suggestions.push({
        role: 'Machine Learning Engineer',
        level: experienceLevel,
        matchScore: Math.min(50 + (mlCount * 10), 95),
        description: 'Build and deploy ML models'
      });
    }

    // Data Science
    const dataSkills = ['data science', 'data analysis', 'python', 'pandas', 'numpy', 'sql', 
                        'statistics', 'data visualization', 'tableau', 'power bi'];
    const dataCount = skills.filter(s => dataSkills.some(ds => s.includes(ds))).length;
    if (dataCount > 0) {
      suggestions.push({
        role: 'Data Scientist',
        level: experienceLevel,
        matchScore: Math.min(50 + (dataCount * 8), 90),
        description: 'Analyze data and build predictive models'
      });
    }

    // MERN Stack
    const mernSkills = ['mongodb', 'express', 'react', 'node'];
    const mernCount = skills.filter(s => mernSkills.some(m => s.includes(m))).length;
    if (mernCount >= 2) {
      suggestions.push({
        role: 'MERN Stack Developer',
        level: experienceLevel,
        matchScore: Math.min(60 + (mernCount * 10), 92),
        description: 'Build full-stack web apps with MongoDB, Express, React, Node.js'
      });
    }

    // Full Stack
    const fullStackSkills = ['react', 'node', 'javascript', 'typescript', 'mongodb', 'express', 
                             'frontend', 'backend', 'api', 'rest', 'angular', 'vue'];
    const fullStackCount = skills.filter(s => fullStackSkills.some(fs => s.includes(fs))).length;
    if (fullStackCount >= 3) {
      suggestions.push({
        role: 'Full Stack Developer',
        level: experienceLevel,
        matchScore: Math.min(55 + (fullStackCount * 7), 88),
        description: 'Build end-to-end web applications'
      });
    }

    // Frontend
    const frontendSkills = ['react', 'angular', 'vue', 'html', 'css', 'javascript', 'ui', 'ux', 'tailwind', 'bootstrap'];
    const frontendCount = skills.filter(s => frontendSkills.some(fe => s.includes(fe))).length;
    if (frontendCount >= 2) {
      suggestions.push({
        role: 'Frontend Developer',
        level: experienceLevel,
        matchScore: Math.min(50 + (frontendCount * 8), 85),
        description: 'Create stunning user interfaces'
      });
    }

    // Backend
    const backendSkills = ['node', 'python', 'java', 'spring', 'django', 'flask', 'api', 'database', 'postgresql', 'mysql'];
    const backendCount = skills.filter(s => backendSkills.some(be => s.includes(be))).length;
    if (backendCount >= 2) {
      suggestions.push({
        role: 'Backend Developer',
        level: experienceLevel,
        matchScore: Math.min(50 + (backendCount * 8), 85),
        description: 'Build robust server-side systems'
      });
    }

    // DevOps
    const devopsSkills = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins', 'terraform', 'linux'];
    const devopsCount = skills.filter(s => devopsSkills.some(d => s.includes(d))).length;
    if (devopsCount >= 2) {
      suggestions.push({
        role: 'DevOps Engineer',
        level: experienceLevel === 'Fresher' ? 'Junior' : experienceLevel,
        matchScore: Math.min(50 + (devopsCount * 9), 82),
        description: 'Automate and optimize infrastructure'
      });
    }

    // Default if no matches
    if (suggestions.length === 0) {
      suggestions.push({
        role: 'Software Developer',
        level: experienceLevel,
        matchScore: 70,
        description: 'General software development roles'
      });
    }

    // Sort and return top 3
    return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  // Match resume against actual jobs in database
  const suggestRolesFromJobs = async (resume) => {
    if (!resume || !resume.skills || resume.skills.length === 0) {
      return suggestRolesFromSkills(resume);
    }

    try {
      // Fetch all jobs from database
      const jobsResponse = await getAllJobs({ status: 'active' });
      
      // If no jobs in database, use skill-based suggestions
      if (!jobsResponse.success || !jobsResponse.data.jobs || jobsResponse.data.jobs.length === 0) {
        return suggestRolesFromSkills(resume);
      }

      const jobs = jobsResponse.data.jobs;
      const resumeSkills = resume.skills.map(s => s.toLowerCase());
      
      const experienceLevel = resumeSkills.length < 5 ? 'Fresher' : 
                             resumeSkills.length < 10 ? 'Junior' : 
                             resumeSkills.length < 15 ? 'Mid-Level' : 'Senior';

      // Group jobs by title and calculate match scores
      const roleMatches = {};
      
      jobs.forEach(job => {
        const jobTitle = job.title;
        const jobRequirements = (job.requirements || job.description || '').toLowerCase();
        const jobSkills = job.requiredSkills ? job.requiredSkills.map(s => s.toLowerCase()) : [];
        
        let matchCount = 0;
        let totalRequired = jobSkills.length || 5;
        
        resumeSkills.forEach(skill => {
          if (jobRequirements.includes(skill) || jobSkills.some(js => js.includes(skill) || skill.includes(js))) {
            matchCount++;
          }
        });
        
        const matchScore = Math.min(Math.round((matchCount / totalRequired) * 100), 98);
        
        if (matchScore >= 50) {
          if (!roleMatches[jobTitle] || roleMatches[jobTitle].matchScore < matchScore) {
            roleMatches[jobTitle] = {
              role: jobTitle,
              level: experienceLevel,
              matchScore: matchScore,
              description: `${job.company || 'Multiple companies'} - ${matchCount} matching skills`,
              jobCount: jobs.filter(j => j.title === jobTitle).length
            };
          }
        }
      });

      const suggestions = Object.values(roleMatches)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3)
        .map(role => ({
          ...role,
          description: role.jobCount > 1 
            ? `${role.jobCount} positions available - ${role.description.split(' - ')[1]}`
            : role.description.split(' - ')[1]
        }));

      // If no job matches but we have jobs in DB, still show skill-based suggestions
      if (suggestions.length === 0) {
        return suggestRolesFromSkills(resume);
      }

      return suggestions;
    } catch (error) {
      console.error('Error fetching jobs for role suggestions:', error);
      return suggestRolesFromSkills(resume);
    }
  };

  // Delete resume handler
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await deleteResume(resumeId);
      
      if (response.success) {
        // Reload resumes list
        await loadResumes();
        alert('Resume deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert(err.response?.data?.message || 'Failed to delete resume');
    } finally {
      setLoading(false);
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
          <div>
            <h3 className="card-title">Best Job Matches</h3>
          </div>
        </div>

        <div className="card-body">
          {/* Resume Selection */}
          {resumes.length > 0 && (
            <div className="input-group">
              <label className="input-label">Select Resume</label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <select
                  className="select"
                  value={selectedResumeId}
                  onChange={(e) => {
                    const resumeId = e.target.value;
                    const resume = resumes.find(r => r._id === resumeId);
                    setSelectedResumeId(resumeId);
                    setSelectedResume(resume);
                    // Fetch role suggestions from actual jobs
                    suggestRolesFromJobs(resume).then(suggestions => {
                      setRoleSuggestions(suggestions);
                    });
                    fetchRecommendations(resumeId);
                  }}
                  style={{ flex: 1 }}
                >
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.name} - {resume.skills.slice(0, 3).join(', ')}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => handleDeleteResume(selectedResumeId)}
                  disabled={loading}
                  style={{
                    background: 'var(--red-500)',
                    color: 'white',
                    padding: '0 var(--space-5)',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Role Suggestions Section */}
          {roleSuggestions.length > 0 && (
            <div style={{ 
              background: 'var(--bg-hover)', 
              padding: 'var(--space-6)', 
              borderRadius: '8px',
              marginBottom: 'var(--space-6)',
              border: '2px solid var(--amber-400)'
            }}>
              <h4 style={{ 
                color: 'var(--amber-400)', 
                marginBottom: 'var(--space-4)',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Recommended Roles for You
              </h4>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--space-5)',
                fontSize: '0.9rem'
              }}>
                Your CV is suitable for these roles:
              </p>
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {roleSuggestions.map((suggestion, index) => (
                  <div key={index} style={{
                    background: 'var(--bg-card)',
                    padding: 'var(--space-5)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <h5 style={{ 
                          color: 'var(--text-primary)', 
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}>
                          {suggestion.role}
                        </h5>
                        <span style={{
                          background: 'var(--amber-400)',
                          color: '#000000',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {suggestion.level}
                        </span>
                      </div>
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        margin: 0,
                        fontSize: '0.85rem'
                      }}>
                        {suggestion.description}
                      </p>
                    </div>
                    <div style={{
                      background: 'var(--amber-400)',
                      color: '#000000',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}>
                      {suggestion.matchScore}%
                    </div>
                  </div>
                ))}
              </div>
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
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
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
              <div className="empty-state-text" style={{ color: 'var(--text-secondary)' }}>
                No job postings available in the database yet. Add jobs to see matches.
              </div>
            </div>
          )}

          {/* Action Button */}
          {jobMatches.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
              <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Recommendations'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobMatchRecommendation;
