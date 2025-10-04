import React, { useState, useEffect } from 'react';
import { getDashboardStats, getTopSkills, getMockAnalytics } from '../api/api';

/**
 * InteractiveDashboard Component
 * Display statistics and analytics (placeholder for charts)
 */
const InteractiveDashboard = () => {
  const [stats, setStats] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to load real data first
      const [statsResponse, skillsResponse] = await Promise.all([
        getDashboardStats().catch(() => getMockAnalytics()),
        getTopSkills(5).catch(() => ({ success: true, data: { topSkills: [] } }))
      ]);

      if (statsResponse.success) {
        const data = statsResponse.data;
        setStats([
    {
      label: 'Total Resumes',
      value: '1,248',
      color: 'var(--color-primary)'
    },
    {
      label: 'Active Jobs',
      value: '356',
      color: 'var(--color-success)'
    },
    {
      label: 'Matches Found',
      value: '892',
      color: 'var(--color-info)'
    },
    {
      label: 'Success Rate',
      value: '94%',
      color: 'var(--color-warning)'
    }]);
      }

      if (skillsResponse.success && skillsResponse.data.topSkills) {
        setTopSkills(skillsResponse.data.topSkills);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set fallback mock data
      setStats([
        { label: 'Total Resumes', value: '248', color: 'var(--color-primary)' },
        { label: 'Active Jobs', value: '56', color: 'var(--color-success)' },
        { label: 'Matches Found', value: '192', color: 'var(--color-info)' },
        { label: 'Success Rate', value: '84%', color: 'var(--color-warning)' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dashboard" className="section">
      <div className="section-header">
        <h2 className="section-title">Interactive Dashboard</h2>
        <p className="section-subtitle">Real-time analytics and insights</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <div style={{ color: 'var(--color-text-secondary)' }}>Loading dashboard...</div>
        </div>
      )}

      {/* Error State */}
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

      {/* Statistics Grid */}
      {!loading && (
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      )}

      {/* Charts Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Analytics Overview</h3>
          </div>
        </div>

        <div className="card-body">
          {/* Top Skills Display */}
          {topSkills.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h4>Top Skills in Database</h4>
              <div className="keyword-grid" style={{ marginTop: 'var(--spacing-md)' }}>
                {topSkills.map((skillData, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{skillData.skill}</span>
                    <span style={{ 
                      background: 'var(--color-primary)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-xs)'
                    }}>{skillData.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Placeholder 1 */}
          <div className="chart-placeholder">
            <div>
              <div>Resume Submissions Over Time</div>
              <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                (Chart integration coming soon)
              </div>
            </div>
          </div>

          {/* Chart Placeholder 2 */}
          <div className="chart-placeholder">
            <div>
              <div>Top Skills Distribution</div>
              <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                (Chart integration coming soon)
              </div>
            </div>
          </div>

          {/* Chart Placeholder 3 */}
          <div className="chart-placeholder">
            <div>
              <div>Match Success Trends</div>
              <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                (Chart integration coming soon)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">ℹ️</div>
          <div>
            <h3 className="card-title">Integration Options</h3>
          </div>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You can integrate popular charting libraries like:
          </p>
          <div className="keyword-grid" style={{ marginTop: 'var(--spacing-md)' }}>
            <span className="badge badge-primary">Chart.js</span>
            <span className="badge badge-primary">Recharts</span>
            <span className="badge badge-primary">Victory</span>
            <span className="badge badge-primary">Nivo</span>
            <span className="badge badge-primary">D3.js</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDashboard;
