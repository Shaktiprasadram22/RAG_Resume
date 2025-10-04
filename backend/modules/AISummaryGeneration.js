/**
 * AI Summary Generation Module
 * Generates professional summaries using OpenAI API
 */

import { generateChatCompletion, isOpenAIConfigured } from '../config/openai.js';

/**
 * Generate professional summary for a resume
 * @param {Object} resumeData - Resume data
 * @returns {Promise<string>} - Generated summary
 */
export const generateResumeSummary = async (resumeData) => {
  try {
    // Create prompt for summary generation
    const prompt = `Generate a professional 3-4 line summary for the following candidate:

Name: ${resumeData.name}
Skills: ${resumeData.skills.join(', ')}
Education: ${resumeData.education.join(', ')}

Create a compelling professional summary highlighting their key strengths and expertise.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional resume writer. Create concise, impactful professional summaries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const summary = await generateChatCompletion(messages, 150);
    return summary;
  } catch (error) {
    console.error('Error in generateResumeSummary:', error.message);
    
    // Fallback summary
    return `${resumeData.name} is a skilled professional with expertise in ${resumeData.skills.slice(0, 3).join(', ')}. Bringing strong technical capabilities and a proven track record in delivering quality results.`;
  }
};

/**
 * Generate job-specific summary
 * @param {Object} resumeData - Resume data
 * @param {Object} jobData - Job data
 * @returns {Promise<string>} - Tailored summary
 */
export const generateJobSpecificSummary = async (resumeData, jobData) => {
  try {
    const prompt = `Create a 3-4 line professional summary for this candidate tailored to the following job:

Job Title: ${jobData.title}
Required Skills: ${jobData.requiredSkills.join(', ')}

Candidate Skills: ${resumeData.skills.join(', ')}
Candidate Education: ${resumeData.education.join(', ')}

Focus on how the candidate's skills align with the job requirements.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert at matching candidates to jobs. Create tailored summaries that highlight relevant experience.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const summary = await generateChatCompletion(messages, 200);
    return summary;
  } catch (error) {
    console.error('Error in generateJobSpecificSummary:', error.message);
    throw error;
  }
};

/**
 * Generate cover letter
 * @param {Object} resumeData - Resume data
 * @param {Object} jobData - Job data
 * @returns {Promise<string>} - Generated cover letter
 */
export const generateCoverLetter = async (resumeData, jobData) => {
  try {
    const prompt = `Write a professional cover letter for:

Candidate: ${resumeData.name}
Skills: ${resumeData.skills.join(', ')}
Education: ${resumeData.education.join(', ')}

Job: ${jobData.title} at ${jobData.company}
Requirements: ${jobData.requiredSkills.join(', ')}

Keep it professional, concise (3-4 paragraphs), and highlight relevant qualifications.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional career counselor who writes compelling cover letters.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const coverLetter = await generateChatCompletion(messages, 500);
    return coverLetter;
  } catch (error) {
    console.error('Error in generateCoverLetter:', error.message);
    throw error;
  }
};

/**
 * Improve existing resume text
 * @param {string} resumeText - Current resume text
 * @returns {Promise<string>} - Improved version
 */
export const improveResumeText = async (resumeText) => {
  try {
    if (!isOpenAIConfigured()) {
      return 'OpenAI API not configured. Cannot improve resume text.';
    }

    const prompt = `Improve and enhance the following resume content. Make it more professional, impactful, and ATS-friendly:

${resumeText}

Provide an improved version with better wording and structure.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert resume writer. Improve resume content while maintaining accuracy.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const improved = await generateChatCompletion(messages, 800);
    return improved;
  } catch (error) {
    console.error('Error in improveResumeText:', error.message);
    throw error;
  }
};

/**
 * Generate skill highlights
 * @param {Array<string>} skills - List of skills
 * @returns {Promise<Array<string>>} - Highlighted skill descriptions
 */
export const generateSkillHighlights = async (skills) => {
  try {
    const prompt = `For each of the following skills, create a one-line professional highlight statement:

${skills.join('\n')}

Format as a JSON array of strings.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a professional resume writer. Create impactful skill descriptions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await generateChatCompletion(messages, 300);
    
    // Try to parse JSON response
    try {
      return JSON.parse(response);
    } catch {
      // If not JSON, split by newlines
      return response.split('\n').filter(line => line.trim().length > 0);
    }
  } catch (error) {
    console.error('Error in generateSkillHighlights:', error.message);
    return skills.map(skill => `Proficient in ${skill}`);
  }
};
