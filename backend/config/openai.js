/**
 * OpenAI API Configuration
 * Setup and export OpenAI client instance
 */

import OpenAI from 'openai';

/**
 * Check if OpenAI API key is configured
 * @returns {boolean}
 */
export const isOpenAIConfigured = () => {
  return !!process.env.OPENAI_API_KEY && 
         process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' &&
         process.env.OPENAI_API_KEY.trim() !== '';
};

// Lazy initialization of OpenAI client
let openai = null;
const getOpenAIClient = () => {
  if (!openai && isOpenAIConfigured()) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

/**
 * Generate text embedding using OpenAI
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
export const generateEmbedding = async (text) => {
  try {
    if (!isOpenAIConfigured()) {
      console.warn('⚠️  OpenAI API key not configured, returning dummy embedding');
      // Return dummy embedding for development
      return Array(1536).fill(0).map(() => Math.random());
    }

    const client = getOpenAIClient();
    const response = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
};

/**
 * Generate chat completion using OpenAI
 * @param {Array} messages - Chat messages array
 * @param {number} maxTokens - Maximum tokens in response
 * @returns {Promise<string>} - AI response
 */
export const generateChatCompletion = async (messages, maxTokens = 500) => {
  try {
    if (!isOpenAIConfigured()) {
      return 'OpenAI API key not configured. This is a demo response.';
    }

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat completion:', error.message);
    throw error;
  }
};

export default getOpenAIClient;
