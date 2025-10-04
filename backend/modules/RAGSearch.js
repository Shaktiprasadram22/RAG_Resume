/**
 * RAG Search Module
 * Semantic search for resumes using embeddings and similarity matching
 */

import { getEmbedding, findTopSimilar, getSimilarityPercentage } from '../utils/embeddingHelper.js';

/**
 * Search resumes using job description
 * @param {string} jobDescription - Job description text
 * @param {Array} resumes - Array of resume documents with embeddings
 * @param {number} topN - Number of top results to return
 * @returns {Promise<Array>} - Top matching resumes
 */
export const searchResumes = async (jobDescription, resumes, topN = 10) => {
  try {
    // Generate embedding for job description
    const queryEmbedding = await getEmbedding(jobDescription);

    // Find top similar resumes
    const topMatches = findTopSimilar(queryEmbedding, resumes, topN);

    // Format results - pass everything from database
    const formattedResults = topMatches.map(match => {
      // Log what we're getting from database
      console.log('📄 Resume from DB:', {
        id: match._id,
        name: match.name,
        email: match.email,
        phone: match.phone,
        uploaderName: match.uploaderName,
        uploaderEmail: match.uploaderEmail,
        filename: match.filename,
        skills: match.skills,
        education: match.education
      });

      return {
        // Pass ALL fields from database
        ...match._doc || match, // Get all MongoDB document fields
        id: match._id?.toString() || match.id,
        matchScore: Math.round(match.similarity * 100)
      };
    });

    return formattedResults;
  } catch (error) {
    console.error('Error in searchResumes:', error.message);
    throw error;
  }
};

/**
 * Search by specific skills
 * @param {Array<string>} requiredSkills - List of required skills
 * @param {Array} resumes - Array of resume documents
 * @returns {Array} - Matching resumes with skill match percentage
 */
export const searchBySkills = (requiredSkills, resumes) => {
  try {
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    const matches = resumes.map(resume => {
      const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());
      
      // Calculate skill overlap
      const matchedSkills = requiredSkillsLower.filter(skill =>
        resumeSkillsLower.includes(skill)
      );

      const matchPercentage = (matchedSkills.length / requiredSkillsLower.length) * 100;

      return {
        ...resume,
        matchedSkills,
        missingSkills: requiredSkillsLower.filter(skill => !resumeSkillsLower.includes(skill)),
        skillMatchPercentage: Math.round(matchPercentage)
      };
    });

    // Sort by match percentage
    return matches
      .filter(m => m.skillMatchPercentage > 0)
      .sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
  } catch (error) {
    console.error('Error in searchBySkills:', error.message);
    throw error;
  }
};

/**
 * Search by experience level keywords
 * @param {string} experienceLevel - Experience level (junior, mid, senior)
 * @param {Array} resumes - Array of resume documents
 * @returns {Array} - Filtered resumes
 */
export const searchByExperience = (experienceLevel, resumes) => {
  const keywords = {
    junior: ['junior', 'entry', 'graduate', '0-2 years', 'fresher'],
    mid: ['mid', 'intermediate', '2-5 years', 'experienced'],
    senior: ['senior', 'lead', 'principal', '5+ years', 'expert', 'architect']
  };

  const levelKeywords = keywords[experienceLevel.toLowerCase()] || [];

  return resumes.filter(resume => {
    const text = resume.rawText.toLowerCase();
    return levelKeywords.some(keyword => text.includes(keyword));
  });
};

/**
 * Advanced search with multiple filters
 * @param {Object} filters - Search filters
 * @param {Array} resumes - Array of resume documents
 * @returns {Promise<Array>} - Filtered and ranked resumes
 */
export const advancedSearch = async (filters, resumes) => {
  try {
    let results = [...resumes];

    // Filter by skills if provided
    if (filters.skills && filters.skills.length > 0) {
      results = searchBySkills(filters.skills, results);
    }

    // Filter by experience level
    if (filters.experienceLevel) {
      results = searchByExperience(filters.experienceLevel, results);
    }

    // Semantic search if job description provided
    if (filters.jobDescription) {
      const queryEmbedding = await getEmbedding(filters.jobDescription);
      results = findTopSimilar(queryEmbedding, results, filters.limit || 20);
    }

    return results;
  } catch (error) {
    console.error('Error in advancedSearch:', error.message);
    throw error;
  }
};

/**
 * Get search statistics
 * @param {Array} searchResults - Search results
 * @returns {Object} - Statistics
 */
export const getSearchStats = (searchResults) => {
  if (!searchResults || searchResults.length === 0) {
    return {
      totalResults: 0,
      averageMatch: 0,
      topMatch: 0
    };
  }

  const scores = searchResults.map(r => r.matchScore || r.similarity * 100);

  return {
    totalResults: searchResults.length,
    averageMatch: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    topMatch: Math.max(...scores),
    bottomMatch: Math.min(...scores)
  };
};
