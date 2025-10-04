/**
 * Job Match Recommendation Module
 * Recommends jobs to candidates based on skills and profile matching
 */

import { cosineSimilarity, getEmbedding } from '../utils/embeddingHelper.js';

/**
 * Calculate job match score for a candidate
 * @param {Object} resumeData - Candidate resume data
 * @param {Object} jobData - Job posting data
 * @returns {Promise<Object>} - Match result with score
 */
export const calculateJobMatch = async (resumeData, jobData) => {
  try {
    // Skill-based matching
    const resumeSkills = resumeData.skills.map(s => s.toLowerCase());
    const requiredSkills = jobData.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(skill => 
      resumeSkills.includes(skill)
    );
    
    const skillMatchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

    // Semantic matching using embeddings
    let semanticScore = 0;
    if (resumeData.embedding && jobData.embedding) {
      semanticScore = cosineSimilarity(resumeData.embedding, jobData.embedding) * 100;
    }

    // Combined score (weighted average)
    const finalScore = (skillMatchPercentage * 0.6) + (semanticScore * 0.4);

    return {
      jobId: jobData._id || jobData.id,
      jobTitle: jobData.title,
      company: jobData.company,
      matchScore: Math.round(finalScore),
      skillMatchPercentage: Math.round(skillMatchPercentage),
      semanticScore: Math.round(semanticScore),
      matchedSkills,
      missingSkills: requiredSkills.filter(skill => !resumeSkills.includes(skill))
    };
  } catch (error) {
    console.error('Error in calculateJobMatch:', error.message);
    throw error;
  }
};

/**
 * Get top job recommendations for a candidate
 * @param {Object} resumeData - Candidate resume data
 * @param {Array} jobs - Array of job postings
 * @param {number} topN - Number of recommendations
 * @returns {Promise<Array>} - Top job matches
 */
export const getJobRecommendations = async (resumeData, jobs, topN = 5) => {
  try {
    // Calculate match for each job
    const matchPromises = jobs.map(job => calculateJobMatch(resumeData, job));
    const matches = await Promise.all(matchPromises);

    // Sort by match score and return top N
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, topN);
  } catch (error) {
    console.error('Error in getJobRecommendations:', error.message);
    throw error;
  }
};

/**
 * Find candidates for a specific job
 * @param {Object} jobData - Job posting data
 * @param {Array} resumes - Array of candidate resumes
 * @param {number} topN - Number of candidates to return
 * @returns {Promise<Array>} - Top matching candidates
 */
export const findCandidatesForJob = async (jobData, resumes, topN = 10) => {
  try {
    const matchPromises = resumes.map(resume => calculateJobMatch(resume, jobData));
    const matches = await Promise.all(matchPromises);

    // Add candidate info to results
    const candidateMatches = matches.map((match, index) => ({
      ...match,
      candidateId: resumes[index]._id || resumes[index].id,
      candidateName: resumes[index].name,
      candidateEmail: resumes[index].email,
      candidateSkills: resumes[index].skills
    }));

    return candidateMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, topN);
  } catch (error) {
    console.error('Error in findCandidatesForJob:', error.message);
    throw error;
  }
};

/**
 * Get match explanation
 * @param {Object} matchResult - Match result object
 * @returns {string} - Human-readable explanation
 */
export const getMatchExplanation = (matchResult) => {
  const score = matchResult.matchScore;
  let explanation = '';

  if (score >= 90) {
    explanation = 'Excellent match! This candidate has most of the required skills.';
  } else if (score >= 75) {
    explanation = 'Good match. The candidate meets many of the requirements.';
  } else if (score >= 60) {
    explanation = 'Moderate match. Some key skills are present but training may be needed.';
  } else {
    explanation = 'Low match. Significant skill gaps exist.';
  }

  return explanation;
};

/**
 * Generate job embedding for new job posting
 * @param {Object} jobData - Job posting data
 * @returns {Promise<Object>} - Job data with embedding
 */
export const generateJobEmbedding = async (jobData) => {
  try {
    // Combine job title, description, and skills into text
    const jobText = `${jobData.title} ${jobData.description} ${jobData.requiredSkills.join(' ')}`;
    
    // Generate embedding
    const embedding = await getEmbedding(jobText);

    return {
      ...jobData,
      embedding
    };
  } catch (error) {
    console.error('Error in generateJobEmbedding:', error.message);
    throw error;
  }
};
