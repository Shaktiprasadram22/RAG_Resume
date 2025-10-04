/**
 * Resume Parsing Utilities
 * Helper functions for extracting text from resumes
 */

import mammoth from 'mammoth';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Extract text from PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromPDF = async (buffer) => {
  try {
    console.log('📄 Attempting to parse PDF...');
    
    if (!buffer || buffer.length === 0) {
      throw new Error('PDF buffer is empty or invalid');
    }
    
    console.log(`📦 PDF buffer size: ${buffer.length} bytes`);
    const data = await pdfParse(buffer);
    console.log(`✅ PDF parsed successfully. Text length: ${data.text.length} characters`);
    
    return data.text;
  } catch (error) {
    console.error('❌ PDF parsing error:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to parse PDF file: ${error.message}`);
  }
};

/**
 * Extract text from DOCX buffer
 * @param {Buffer} buffer - DOCX file buffer
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error.message);
    throw new Error('Failed to parse DOCX file');
  }
};

/**
 * Extract text from resume file based on type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - Extracted text
 */
export const extractResumeText = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(buffer);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    return await extractTextFromDOCX(buffer);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.');
  }
};

/**
 * Extract email from text using regex
 * @param {string} text - Input text
 * @returns {string|null} - Extracted email or null
 */
export const extractEmail = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

/**
 * Extract phone number from text
 * @param {string} text - Input text
 * @returns {string|null} - Extracted phone or null
 */
export const extractPhone = (text) => {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
};

/**
 * Extract potential name from resume text
 * Usually the first line or first few words
 * @param {string} text - Resume text
 * @returns {string} - Extracted name
 */
export const extractName = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    // Get first non-empty line
    const firstLine = lines[0].trim();
    // Return first line if it's not too long (likely a name)
    if (firstLine.length < 50) {
      return firstLine;
    }
  }
  return 'Unknown';
};

/**
 * Extract skills from resume text
 * Uses common skill keywords
 * @param {string} text - Resume text
 * @returns {string[]} - Array of extracted skills
 */
export const extractSkills = (text) => {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue.js',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'TypeScript', 'HTML', 'CSS', 'Redux', 'Express', 'Django', 'Flask',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'AI', 'Data Science', 'Agile',
    'Scrum', 'REST API', 'GraphQL', 'SQL', 'NoSQL', 'Redis', 'CI/CD', 'Jenkins'
  ];

  const textLower = text.toLowerCase();
  const foundSkills = commonSkills.filter(skill => 
    textLower.includes(skill.toLowerCase())
  );

  return [...new Set(foundSkills)]; // Remove duplicates
};

/**
 * Extract education information
 * @param {string} text - Resume text
 * @returns {string[]} - Array of education entries
 */
export const extractEducation = (text) => {
  const degrees = ['Bachelor', 'Master', 'PhD', 'B.S.', 'M.S.', 'B.Tech', 'M.Tech', 'MBA'];
  const lines = text.split('\n');
  const education = [];

  lines.forEach(line => {
    degrees.forEach(degree => {
      if (line.includes(degree)) {
        education.push(line.trim());
      }
    });
  });

  return [...new Set(education)]; // Remove duplicates
};

/**
 * Parse resume text into structured data
 * @param {string} text - Raw resume text
 * @returns {Object} - Structured resume data
 */
export const parseResumeToStructured = (text) => {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    education: extractEducation(text),
    rawText: text,
    wordCount: text.split(/\s+/).length
  };
};
