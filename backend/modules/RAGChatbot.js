/**
 * RAG Chatbot Module
 * Handles conversational queries about resumes and jobs
 */

import { generateChatCompletion, isOpenAIConfigured } from '../config/openai.js';
import { getEmbedding, findTopSimilar } from '../utils/embeddingHelper.js';

/**
 * Process chat message and generate response
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages
 * @param {Object} context - Additional context (resumes, jobs)
 * @returns {Promise<Object>} - Chat response
 */
export const processChatMessage = async (userMessage, conversationHistory = [], context = {}) => {
  try {
    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are ResumeRAG Assistant, an AI helper for resume analysis and job matching. 
You help users with:
- Finding matching resumes for job descriptions
- Recommending jobs to candidates
- Analyzing resume content
- Providing career advice
- Explaining match scores

Be helpful, professional, and concise.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Generate response
    const response = await generateChatCompletion(messages, 300);

    return {
      message: response,
      timestamp: new Date().toISOString(),
      role: 'assistant'
    };
  } catch (error) {
    console.error('Error in processChatMessage:', error.message);
    
    // Fallback response
    return {
      message: 'I apologize, but I encountered an error processing your request. Please try again.',
      timestamp: new Date().toISOString(),
      role: 'assistant'
    };
  }
};

/**
 * Search resumes based on natural language query
 * @param {string} query - Natural language query
 * @param {Array} resumes - Available resumes
 * @returns {Promise<Object>} - Search results and response
 */
export const chatSearchResumes = async (query, resumes) => {
  try {
    // Generate embedding for query
    const queryEmbedding = await getEmbedding(query);

    // Find similar resumes
    const matches = findTopSimilar(queryEmbedding, resumes, 5);

    // Format results
    const formattedMatches = matches.map(match => ({
      name: match.name,
      email: match.email,
      skills: match.skills.slice(0, 5),
      matchScore: Math.round(match.similarity * 100)
    }));

    // Generate natural language response
    let responseText = '';
    if (formattedMatches.length > 0) {
      responseText = `I found ${formattedMatches.length} matching candidates:\n\n`;
      formattedMatches.forEach((match, idx) => {
        responseText += `${idx + 1}. ${match.name} (${match.matchScore}% match)\n`;
        responseText += `   Skills: ${match.skills.join(', ')}\n`;
        responseText += `   Email: ${match.email}\n\n`;
      });
    } else {
      responseText = 'I couldn\'t find any matching candidates for your query.';
    }

    return {
      message: responseText,
      results: formattedMatches,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in chatSearchResumes:', error.message);
    throw error;
  }
};

/**
 * Answer questions about a specific resume
 * @param {string} question - User's question
 * @param {Object} resumeData - Resume data
 * @returns {Promise<string>} - Answer
 */
export const answerResumeQuestion = async (question, resumeData) => {
  try {
    const resumeContext = `
Resume Information:
Name: ${resumeData.name}
Email: ${resumeData.email}
Skills: ${resumeData.skills.join(', ')}
Education: ${resumeData.education.join(', ')}
Word Count: ${resumeData.wordCount}
`;

    const messages = [
      {
        role: 'system',
        content: 'You are analyzing a specific resume. Answer questions based on the provided resume data.'
      },
      {
        role: 'user',
        content: `${resumeContext}\n\nQuestion: ${question}`
      }
    ];

    const answer = await generateChatCompletion(messages, 200);
    return answer;
  } catch (error) {
    console.error('Error in answerResumeQuestion:', error.message);
    throw error;
  }
};

/**
 * Get career advice
 * @param {string} question - Career-related question
 * @param {Object} userProfile - User's profile data
 * @returns {Promise<string>} - Career advice
 */
export const getCareerAdvice = async (question, userProfile = {}) => {
  try {
    let context = 'Provide general career advice.';
    
    if (userProfile.skills) {
      context = `User has skills in: ${userProfile.skills.join(', ')}`;
    }

    const messages = [
      {
        role: 'system',
        content: `You are a professional career counselor. Provide helpful, actionable career advice. ${context}`
      },
      {
        role: 'user',
        content: question
      }
    ];

    const advice = await generateChatCompletion(messages, 400);
    return advice;
  } catch (error) {
    console.error('Error in getCareerAdvice:', error.message);
    throw error;
  }
};

/**
 * Suggest interview questions based on job description
 * @param {Object} jobData - Job data
 * @returns {Promise<Array<string>>} - Interview questions
 */
export const suggestInterviewQuestions = async (jobData) => {
  try {
    const prompt = `Generate 5 relevant interview questions for the following job position:

Job Title: ${jobData.title}
Required Skills: ${jobData.requiredSkills.join(', ')}
Description: ${jobData.description || 'N/A'}

Provide questions that assess both technical skills and cultural fit.`;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert interviewer. Generate relevant, insightful interview questions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await generateChatCompletion(messages, 400);
    
    // Split response into questions
    const questions = response
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return questions;
  } catch (error) {
    console.error('Error in suggestInterviewQuestions:', error.message);
    return [
      'Tell me about your experience with the technologies mentioned in the job description.',
      'Describe a challenging project you worked on and how you overcame obstacles.',
      'How do you stay updated with the latest industry trends?',
      'What interests you most about this position?',
      'How do you approach problem-solving in a team environment?'
    ];
  }
};

/**
 * Classify user intent from message
 * @param {string} message - User message
 * @returns {string} - Intent category
 */
export const classifyIntent = (message) => {
  const messageLower = message.toLowerCase();

  if (messageLower.includes('search') || messageLower.includes('find') || messageLower.includes('looking for')) {
    return 'search';
  }
  
  if (messageLower.includes('recommend') || messageLower.includes('suggest') || messageLower.includes('match')) {
    return 'recommendation';
  }
  
  if (messageLower.includes('analyze') || messageLower.includes('review') || messageLower.includes('feedback')) {
    return 'analysis';
  }
  
  if (messageLower.includes('how') || messageLower.includes('what') || messageLower.includes('why')) {
    return 'question';
  }
  
  return 'general';
};

/**
 * Generate greeting message
 * @returns {string} - Greeting
 */
export const getGreeting = () => {
  const greetings = [
    'Hello! I\'m your ResumeRAG assistant. How can I help you today?',
    'Hi there! Ready to help you with resume analysis and job matching.',
    'Welcome! Ask me anything about resumes, jobs, or career advice.',
    'Greetings! I can help you find the perfect candidate or job match.'
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
};
