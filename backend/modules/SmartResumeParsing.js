/**
 * Smart Resume Parsing Module
 * Handles resume upload, text extraction, and structured data creation
 */

import { extractResumeText, parseResumeToStructured } from '../utils/parseUtils.js';
import { getEmbedding } from '../utils/embeddingHelper.js';

/**
 * Parse uploaded resume file
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimetype - File MIME type
 * @param {string} originalname - Original filename
 * @returns {Promise<Object>} - Parsed resume data
 */
export const parseResume = async (fileBuffer, mimetype, originalname) => {
  try {
    // Extract text from file
    const extractedText = await extractResumeText(fileBuffer, mimetype);

    // Parse text into structured data
    const structuredData = parseResumeToStructured(extractedText);

    // Generate embedding for semantic search
    const embedding = await getEmbedding(extractedText);

    // Combine all data
    const parsedResume = {
      filename: originalname,
      ...structuredData,
      embedding,
      uploadedAt: new Date()
    };

    return parsedResume;
  } catch (error) {
    console.error('Error in parseResume:', error.message);
    throw error;
  }
};

/**
 * Validate resume file
 * @param {Object} file - Multer file object
 * @returns {Object} - Validation result
 */
export const validateResumeFile = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return {
      valid: false,
      error: 'No file uploaded'
    };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF and DOCX files are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  return {
    valid: true
  };
};

/**
 * Extract key information summary
 * @param {Object} resumeData - Parsed resume data
 * @returns {Object} - Summary information
 */
export const getResumeSummary = (resumeData) => {
  return {
    name: resumeData.name,
    email: resumeData.email,
    phone: resumeData.phone,
    skillCount: resumeData.skills.length,
    topSkills: resumeData.skills.slice(0, 5),
    educationCount: resumeData.education.length,
    wordCount: resumeData.wordCount
  };
};

/**
 * Batch process multiple resumes
 * @param {Array} files - Array of file objects
 * @returns {Promise<Array>} - Array of parsed resumes
 */
export const batchParseResumes = async (files) => {
  try {
    const parsePromises = files.map(file => 
      parseResume(file.buffer, file.mimetype, file.originalname)
    );

    const results = await Promise.all(parsePromises);
    return results;
  } catch (error) {
    console.error('Error in batch parsing:', error.message);
    throw error;
  }
};
