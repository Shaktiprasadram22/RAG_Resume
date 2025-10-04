/**
 * Interactive Dashboard Module
 * Provides analytics and statistics for the dashboard
 */

/**
 * Get overall system statistics
 * @param {Array} resumes - All resumes in database
 * @param {Array} jobs - All jobs in database
 * @returns {Object} - Dashboard statistics
 */
export const getDashboardStats = (resumes, jobs) => {
  try {
    const stats = {
      totalResumes: resumes.length,
      totalJobs: jobs.length,
      recentResumes: resumes.slice(-30).length, // Last 30
      activeJobs: jobs.filter(job => job.status === 'active').length,
      timestamp: new Date().toISOString()
    };

    return stats;
  } catch (error) {
    console.error('Error in getDashboardStats:', error.message);
    throw error;
  }
};

/**
 * Get top skills from all resumes
 * @param {Array} resumes - All resumes
 * @param {number} topN - Number of top skills to return
 * @returns {Array} - Top skills with counts
 */
export const getTopSkills = (resumes, topN = 10) => {
  try {
    const skillCount = {};

    // Count all skills
    resumes.forEach(resume => {
      if (resume.skills && Array.isArray(resume.skills)) {
        resume.skills.forEach(skill => {
          const skillLower = skill.toLowerCase();
          skillCount[skillLower] = (skillCount[skillLower] || 0) + 1;
        });
      }
    });

    // Convert to array and sort
    const topSkills = Object.entries(skillCount)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / resumes.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);

    return topSkills;
  } catch (error) {
    console.error('Error in getTopSkills:', error.message);
    throw error;
  }
};

/**
 * Get resume submissions over time
 * @param {Array} resumes - All resumes
 * @param {number} days - Number of days to analyze
 * @returns {Array} - Daily submission counts
 */
export const getResumeSubmissionTrend = (resumes, days = 30) => {
  try {
    const now = new Date();
    const dailyCounts = {};

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCounts[dateStr] = 0;
    }

    // Count resumes per day
    resumes.forEach(resume => {
      if (resume.uploadedAt) {
        const dateStr = new Date(resume.uploadedAt).toISOString().split('T')[0];
        if (dailyCounts.hasOwnProperty(dateStr)) {
          dailyCounts[dateStr]++;
        }
      }
    });

    // Convert to array format
    const trend = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return trend;
  } catch (error) {
    console.error('Error in getResumeSubmissionTrend:', error.message);
    throw error;
  }
};

/**
 * Get job posting statistics
 * @param {Array} jobs - All jobs
 * @returns {Object} - Job statistics
 */
export const getJobStats = (jobs) => {
  try {
    const stats = {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'active').length,
      closed: jobs.filter(j => j.status === 'closed').length,
      draft: jobs.filter(j => j.status === 'draft').length
    };

    // Top companies
    const companyCount = {};
    jobs.forEach(job => {
      if (job.company) {
        companyCount[job.company] = (companyCount[job.company] || 0) + 1;
      }
    });

    stats.topCompanies = Object.entries(companyCount)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return stats;
  } catch (error) {
    console.error('Error in getJobStats:', error.message);
    throw error;
  }
};

/**
 * Get match success rate
 * @param {Array} matches - All match records
 * @returns {Object} - Success metrics
 */
export const getMatchSuccessRate = (matches) => {
  try {
    const total = matches.length;
    const successful = matches.filter(m => m.matchScore >= 80).length;
    const moderate = matches.filter(m => m.matchScore >= 60 && m.matchScore < 80).length;
    const low = matches.filter(m => m.matchScore < 60).length;

    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

    return {
      total,
      successful,
      moderate,
      low,
      successRate,
      averageScore: total > 0 
        ? Math.round(matches.reduce((sum, m) => sum + (m.matchScore || 0), 0) / total)
        : 0
    };
  } catch (error) {
    console.error('Error in getMatchSuccessRate:', error.message);
    throw error;
  }
};

/**
 * Get education distribution
 * @param {Array} resumes - All resumes
 * @returns {Array} - Education level distribution
 */
export const getEducationDistribution = (resumes) => {
  try {
    const educationLevels = {
      'Bachelor': 0,
      'Master': 0,
      'PhD': 0,
      'Other': 0
    };

    resumes.forEach(resume => {
      if (resume.education && resume.education.length > 0) {
        const eduText = resume.education.join(' ').toLowerCase();
        
        if (eduText.includes('phd') || eduText.includes('doctorate')) {
          educationLevels['PhD']++;
        } else if (eduText.includes('master') || eduText.includes('m.s') || eduText.includes('mba')) {
          educationLevels['Master']++;
        } else if (eduText.includes('bachelor') || eduText.includes('b.s') || eduText.includes('b.tech')) {
          educationLevels['Bachelor']++;
        } else {
          educationLevels['Other']++;
        }
      }
    });

    return Object.entries(educationLevels).map(([level, count]) => ({
      level,
      count,
      percentage: resumes.length > 0 ? Math.round((count / resumes.length) * 100) : 0
    }));
  } catch (error) {
    console.error('Error in getEducationDistribution:', error.message);
    throw error;
  }
};

/**
 * Get comprehensive analytics
 * @param {Object} data - All data (resumes, jobs, matches)
 * @returns {Object} - Complete analytics
 */
export const getComprehensiveAnalytics = (data) => {
  try {
    const { resumes = [], jobs = [], matches = [] } = data;

    return {
      overview: getDashboardStats(resumes, jobs),
      topSkills: getTopSkills(resumes, 10),
      submissionTrend: getResumeSubmissionTrend(resumes, 30),
      jobStats: getJobStats(jobs),
      matchStats: getMatchSuccessRate(matches),
      educationDistribution: getEducationDistribution(resumes),
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getComprehensiveAnalytics:', error.message);
    throw error;
  }
};

/**
 * Generate mock analytics for demonstration
 * @returns {Object} - Mock analytics data
 */
export const getMockAnalytics = () => {
  return {
    overview: {
      totalResumes: 1248,
      totalJobs: 356,
      recentResumes: 87,
      activeJobs: 234
    },
    topSkills: [
      { skill: 'javascript', count: 456, percentage: 37 },
      { skill: 'python', count: 398, percentage: 32 },
      { skill: 'react', count: 356, percentage: 29 },
      { skill: 'node.js', count: 289, percentage: 23 },
      { skill: 'java', count: 267, percentage: 21 }
    ],
    matchStats: {
      total: 892,
      successful: 627,
      moderate: 189,
      low: 76,
      successRate: 70,
      averageScore: 78
    }
  };
};
