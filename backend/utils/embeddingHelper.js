/**
 * Embedding Helper Utilities
 * Functions for generating embeddings and computing similarity
 */

import { generateEmbedding } from '../config/openai.js';

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Similarity score (0-1)
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  // Calculate dot product
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  // Calculate magnitudes
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  // Avoid division by zero
  if (normA === 0 || normB === 0) {
    return 0;
  }

  // Return cosine similarity
  return dotProduct / (normA * normB);
};

/**
 * Generate embedding for text using OpenAI
 * @param {string} text - Input text
 * @returns {Promise<number[]>} - Embedding vector
 */
export const getEmbedding = async (text) => {
  try {
    const embedding = await generateEmbedding(text);
    return embedding;
  } catch (error) {
    console.error('Error in getEmbedding:', error.message);
    // Return dummy embedding on error
    return Array(1536).fill(0).map(() => Math.random());
  }
};

/**
 * Find top N most similar items from a list
 * @param {number[]} queryEmbedding - Query vector
 * @param {Array} items - Array of items with embeddings
 * @param {number} topN - Number of top results to return
 * @returns {Array} - Sorted array of items with similarity scores
 */
export const findTopSimilar = (queryEmbedding, items, topN = 5) => {
  // Calculate similarity for each item
  const itemsWithScores = items.map(item => ({
    ...item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding)
  }));

  // Sort by similarity (descending) and return top N
  return itemsWithScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
};

/**
 * Calculate similarity percentage (0-100)
 * @param {number[]} vecA - First vector
 * @param {number[]} vecB - Second vector
 * @returns {number} - Similarity percentage
 */
export const getSimilarityPercentage = (vecA, vecB) => {
  const similarity = cosineSimilarity(vecA, vecB);
  return Math.round(similarity * 100);
};

/**
 * Batch generate embeddings for multiple texts
 * @param {string[]} texts - Array of texts
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export const batchGenerateEmbeddings = async (texts) => {
  try {
    const embeddings = await Promise.all(
      texts.map(text => getEmbedding(text))
    );
    return embeddings;
  } catch (error) {
    console.error('Error in batch embedding generation:', error.message);
    throw error;
  }
};
