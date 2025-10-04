/**
 * API Integration Layer
 * Centralized API calls to backend
 */

import axios from 'axios';

// Base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth tokens (future use)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('Network Error:', error.message);
    } else {
      // Request setup error
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ================================
// Resume API Calls
// ================================

/**
 * Upload and parse resume
 * @param {File} file - Resume file (PDF/DOCX)
 * @param {Object} userInfo - User information {userId, userName, userEmail}
 * @returns {Promise} - Parsed resume data
 */
export const uploadResume = async (file, userInfo) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('userId', userInfo.userId);
  formData.append('userName', userInfo.userName);
  formData.append('userEmail', userInfo.userEmail);

  const response = await api.post('/api/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Get all resumes
 * @param {Object} params - Query parameters
 * @returns {Promise} - List of resumes
 */
export const getAllResumes = async (params = {}) => {
  const response = await api.get('/api/resume', { params });
  return response.data;
};

/**
 * Get resume by ID
 * @param {string} id - Resume ID
 * @returns {Promise} - Resume data
 */
export const getResumeById = async (id) => {
  const response = await api.get(`/api/resume/${id}`);
  return response.data;
};

/**
 * Search resumes using job description
 * @param {string} jobDescription - Job description text
 * @param {number} limit - Number of results
 * @returns {Promise} - Search results
 */
export const searchResumes = async (jobDescription, limit = 10) => {
  const response = await api.post('/api/resume/search', {
    jobDescription,
    limit,
  });
  return response.data;
};

/**
 * Search resumes by skills
 * @param {Array<string>} skills - List of skills
 * @returns {Promise} - Search results
 */
export const searchBySkills = async (skills) => {
  const response = await api.post('/api/resume/search-by-skills', { skills });
  return response.data;
};

/**
 * Generate AI summary for resume
 * @param {string} resumeId - Resume ID
 * @returns {Promise} - Generated summary
 */
export const generateResumeSummary = async (resumeId) => {
  const response = await api.post(`/api/resume/${resumeId}/generate-summary`);
  return response.data;
};

/**
 * Optimize keywords for resume
 * @param {string} resumeId - Resume ID
 * @param {string} jobDescription - Job description
 * @returns {Promise} - Keyword analysis
 */
export const optimizeKeywords = async (resumeId, jobDescription) => {
  const response = await api.post(`/api/resume/${resumeId}/optimize-keywords`, {
    jobDescription,
  });
  return response.data;
};

/**
 * Delete resume
 * @param {string} id - Resume ID
 * @returns {Promise} - Deletion result
 */
export const deleteResume = async (id) => {
  const response = await api.delete(`/api/resume/${id}`);
  return response.data;
};

// ================================
// Job API Calls
// ================================

/**
 * Create new job posting
 * @param {Object} jobData - Job information
 * @returns {Promise} - Created job
 */
export const createJob = async (jobData) => {
  const response = await api.post('/api/jobs', jobData);
  return response.data;
};

/**
 * Get all jobs
 * @param {Object} params - Query parameters
 * @returns {Promise} - List of jobs
 */
export const getAllJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  return response.data;
};

/**
 * Get job by ID
 * @param {string} id - Job ID
 * @returns {Promise} - Job data
 */
export const getJobById = async (id) => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};

/**
 * Find candidates for a job
 * @param {string} jobId - Job ID
 * @param {number} limit - Number of candidates
 * @returns {Promise} - Matching candidates
 */
export const findCandidatesForJob = async (jobId, limit = 10) => {
  const response = await api.post(`/api/jobs/${jobId}/find-candidates`, { limit });
  return response.data;
};

/**
 * Get job recommendations for a resume
 * @param {string} resumeId - Resume ID
 * @param {number} limit - Number of recommendations
 * @returns {Promise} - Job recommendations
 */
export const getJobRecommendations = async (resumeId, limit = 5) => {
  const response = await api.post('/api/jobs/recommend', { resumeId, limit });
  return response.data;
};

/**
 * Update job posting
 * @param {string} id - Job ID
 * @param {Object} updates - Updated data
 * @returns {Promise} - Updated job
 */
export const updateJob = async (id, updates) => {
  const response = await api.put(`/api/jobs/${id}`, updates);
  return response.data;
};

/**
 * Delete job posting
 * @param {string} id - Job ID
 * @returns {Promise} - Deletion result
 */
export const deleteJob = async (id) => {
  const response = await api.delete(`/api/jobs/${id}`);
  return response.data;
};

// ================================
// Chatbot API Calls
// ================================

/**
 * Send message to chatbot
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous messages
 * @returns {Promise} - Bot response
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  const response = await api.post('/api/chatbot/message', {
    message,
    conversationHistory,
  });
  return response.data;
};

/**
 * Search resumes via natural language
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
export const chatSearchResumes = async (query) => {
  const response = await api.post('/api/chatbot/search', { query });
  return response.data;
};

/**
 * Ask question about specific resume
 * @param {string} resumeId - Resume ID
 * @param {string} question - Question text
 * @returns {Promise} - Answer
 */
export const askResumeQuestion = async (resumeId, question) => {
  const response = await api.post('/api/chatbot/resume-question', {
    resumeId,
    question,
  });
  return response.data;
};

/**
 * Get career advice
 * @param {string} question - Career question
 * @param {string} resumeId - Optional resume ID
 * @returns {Promise} - Career advice
 */
export const getCareerAdvice = async (question, resumeId = null) => {
  const response = await api.post('/api/chatbot/career-advice', {
    question,
    resumeId,
  });
  return response.data;
};

/**
 * Generate interview questions for a job
 * @param {string} jobId - Job ID
 * @returns {Promise} - Interview questions
 */
export const getInterviewQuestions = async (jobId) => {
  const response = await api.post('/api/chatbot/interview-questions', { jobId });
  return response.data;
};

/**
 * Get greeting message
 * @returns {Promise} - Greeting
 */
export const getChatGreeting = async () => {
  const response = await api.get('/api/chatbot/greeting');
  return response.data;
};

// ================================
// Dashboard API Calls
// ================================

/**
 * Get dashboard statistics
 * @returns {Promise} - Dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

/**
 * Get top skills
 * @param {number} limit - Number of top skills
 * @returns {Promise} - Top skills data
 */
export const getTopSkills = async (limit = 10) => {
  const response = await api.get('/api/dashboard/top-skills', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get resume submission trend
 * @param {number} days - Number of days
 * @returns {Promise} - Trend data
 */
export const getSubmissionTrend = async (days = 30) => {
  const response = await api.get('/api/dashboard/submission-trend', {
    params: { days },
  });
  return response.data;
};

/**
 * Get job statistics
 * @returns {Promise} - Job stats
 */
export const getJobStats = async () => {
  const response = await api.get('/api/dashboard/job-stats');
  return response.data;
};

/**
 * Get education distribution
 * @returns {Promise} - Education data
 */
export const getEducationDistribution = async () => {
  const response = await api.get('/api/dashboard/education-distribution');
  return response.data;
};

/**
 * Get comprehensive analytics
 * @returns {Promise} - Complete analytics
 */
export const getComprehensiveAnalytics = async () => {
  const response = await api.get('/api/dashboard/analytics');
  return response.data;
};

/**
 * Get mock analytics (for testing)
 * @returns {Promise} - Mock data
 */
export const getMockAnalytics = async () => {
  const response = await api.get('/api/dashboard/mock');
  return response.data;
};

// ================================
// Health Check
// ================================

/**
 * Check backend health status
 * @returns {Promise} - Health status
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
