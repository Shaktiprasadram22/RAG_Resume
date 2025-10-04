/**
 * Keyword Optimization Module
 * Analyzes resume against job descriptions and suggests missing keywords
 */

import { extractSkills } from '../utils/parseUtils.js';

/**
 * Extract keywords from text
 * @param {string} text - Input text
 * @returns {Array<string>} - Extracted keywords
 */
export const extractKeywords = (text) => {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]);

  // Split text into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top keywords by frequency
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);

  return keywords;
};

/**
 * Compare resume keywords with job description
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {Object} - Keyword analysis
 */
export const analyzeKeywords = (resumeText, jobDescription) => {
  try {
    // Extract keywords from both texts
    const resumeKeywords = new Set(extractKeywords(resumeText));
    const jobKeywords = new Set(extractKeywords(jobDescription));

    // Extract skills specifically
    const resumeSkills = new Set(extractSkills(resumeText).map(s => s.toLowerCase()));
    const jobSkills = new Set(extractSkills(jobDescription).map(s => s.toLowerCase()));

    // Find matched and missing keywords
    const matchedKeywords = [...jobKeywords].filter(kw => resumeKeywords.has(kw));
    const missingKeywords = [...jobKeywords].filter(kw => !resumeKeywords.has(kw));

    // Find matched and missing skills
    const matchedSkills = [...jobSkills].filter(skill => resumeSkills.has(skill));
    const missingSkills = [...jobSkills].filter(skill => !resumeSkills.has(skill));

    // Calculate match score
    const totalJobKeywords = jobKeywords.size;
    const matchScore = totalJobKeywords > 0 
      ? Math.round((matchedKeywords.length / totalJobKeywords) * 100)
      : 0;

    return {
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 15), // Limit to top 15
      matchedSkills,
      missingSkills,
      matchScore,
      totalJobKeywords,
      totalMatchedKeywords: matchedKeywords.length
    };
  } catch (error) {
    console.error('Error in analyzeKeywords:', error.message);
    throw error;
  }
};

/**
 * Generate keyword optimization suggestions
 * @param {Object} keywordAnalysis - Result from analyzeKeywords
 * @returns {Array<string>} - List of suggestions
 */
export const generateOptimizationSuggestions = (keywordAnalysis) => {
  const suggestions = [];

  // Suggestions for missing skills
  if (keywordAnalysis.missingSkills.length > 0) {
    suggestions.push(
      `Add these key skills to your resume if you have them: ${keywordAnalysis.missingSkills.slice(0, 5).join(', ')}`
    );
  }

  // Suggestions based on match score
  if (keywordAnalysis.matchScore < 50) {
    suggestions.push(
      'Your resume has low keyword overlap with the job description. Consider tailoring it more specifically to this role.'
    );
  } else if (keywordAnalysis.matchScore < 70) {
    suggestions.push(
      'Good keyword match, but there\'s room for improvement. Review missing keywords and add relevant ones.'
    );
  } else {
    suggestions.push(
      'Excellent keyword match! Your resume aligns well with the job requirements.'
    );
  }

  // Add specific missing keywords
  if (keywordAnalysis.missingKeywords.length > 0) {
    const topMissing = keywordAnalysis.missingKeywords.slice(0, 5);
    suggestions.push(
      `Consider incorporating these keywords: ${topMissing.join(', ')}`
    );
  }

  // Skills-specific suggestion
  const skillMatchRate = keywordAnalysis.matchedSkills.length / 
    (keywordAnalysis.matchedSkills.length + keywordAnalysis.missingSkills.length) * 100;

  if (skillMatchRate < 60) {
    suggestions.push(
      'Focus on highlighting technical skills that match the job requirements.'
    );
  }

  return suggestions;
};

/**
 * Optimize resume text by suggesting placements
 * @param {string} resumeText - Original resume text
 * @param {Array<string>} missingKeywords - Keywords to add
 * @returns {Object} - Optimization recommendations
 */
export const getKeywordPlacementSuggestions = (resumeText, missingKeywords) => {
  const sections = {
    summary: 'Professional Summary or Objective section',
    skills: 'Skills or Technical Skills section',
    experience: 'Work Experience descriptions',
    projects: 'Projects or Achievements section'
  };

  const recommendations = missingKeywords.slice(0, 10).map(keyword => {
    // Determine best section for keyword
    let suggestedSection = 'skills';
    
    if (['led', 'managed', 'developed', 'implemented', 'designed'].some(v => keyword.includes(v))) {
      suggestedSection = 'experience';
    } else if (['project', 'built', 'created'].some(v => keyword.includes(v))) {
      suggestedSection = 'projects';
    }

    return {
      keyword,
      section: sections[suggestedSection],
      priority: 'high'
    };
  });

  return recommendations;
};

/**
 * Calculate ATS (Applicant Tracking System) score
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description
 * @returns {Object} - ATS score and factors
 */
export const calculateATSScore = (resumeText, jobDescription) => {
  try {
    const analysis = analyzeKeywords(resumeText, jobDescription);
    
    // Different scoring factors
    const keywordScore = analysis.matchScore; // 0-100
    const skillScore = analysis.matchedSkills.length > 0 
      ? (analysis.matchedSkills.length / (analysis.matchedSkills.length + analysis.missingSkills.length)) * 100
      : 0;
    
    // Check for common ATS-friendly elements
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
    const hasStandardSections = /experience|education|skills/i.test(resumeText);
    
    const formattingScore = (
      (hasEmail ? 33 : 0) +
      (hasPhone ? 33 : 0) +
      (hasStandardSections ? 34 : 0)
    );

    // Calculate overall ATS score
    const overallScore = Math.round(
      (keywordScore * 0.5) + 
      (skillScore * 0.3) + 
      (formattingScore * 0.2)
    );

    return {
      overallScore,
      keywordScore: Math.round(keywordScore),
      skillScore: Math.round(skillScore),
      formattingScore,
      factors: {
        hasEmail,
        hasPhone,
        hasStandardSections,
        keywordMatch: analysis.matchScore,
        skillMatch: analysis.matchedSkills.length
      },
      grade: getScoreGrade(overallScore)
    };
  } catch (error) {
    console.error('Error in calculateATSScore:', error.message);
    throw error;
  }
};

/**
 * Get grade based on score
 * @param {number} score - Score 0-100
 * @returns {string} - Grade letter
 */
const getScoreGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};
