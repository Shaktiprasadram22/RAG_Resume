import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login/recruiter');
  };

  if (!user) return null;

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-icon">R</div>
            <span>ResumeRAG</span>
          </div>
          <div className="role-badge">
            <span className={`badge ${isRecruiter ? 'recruiter' : 'candidate'}`}>
              {isRecruiter ? '👔 Recruiter' : '👤 Job Seeker'}
            </span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
