/**
 * Resume Routes
 * Handles all resume-related endpoints
 */

import express from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse, createdResponse } from '../utils/responseHelper.js';
import { parseResume, validateResumeFile, getResumeSummary } from '../modules/SmartResumeParsing.js';
import { searchResumes, searchBySkills, advancedSearch } from '../modules/RAGSearch.js';
import { generateResumeSummary, generateJobSpecificSummary } from '../modules/AISummaryGeneration.js';
import { analyzeKeywords, generateOptimizationSuggestions, calculateATSScore } from '../modules/KeywordOptimization.js';
import Resume from '../models/Resume.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * @route   POST /api/resume/upload
 * @desc    Upload and parse resume
 * @access  Public
 */
router.post('/upload', upload.single('resume'), asyncHandler(async (req, res) => {
  // Validate file
  const validation = validateResumeFile(req.file);
  if (!validation.valid) {
    return errorResponse(res, 400, validation.error);
  }

  // Get user info from request body
  const { userId, userName, userEmail } = req.body;
  
  if (!userId || !userName || !userEmail) {
    return errorResponse(res, 400, 'User information is required');
  }

  // Parse resume
  const parsedData = await parseResume(
    req.file.buffer,
    req.file.mimetype,
    req.file.originalname
  );

  // Add user information to parsed data
  parsedData.userId = userId;
  parsedData.uploaderName = userName;
  parsedData.uploaderEmail = userEmail;

  // Save to database
  const resume = new Resume(parsedData);
  await resume.save();

  return createdResponse(res, 'Resume uploaded and parsed successfully', {
    id: resume._id,
    summary: getResumeSummary(parsedData)
  });
}));

/**
 * @route   GET /api/resume
 * @desc    Get resumes (filtered by user role)
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 50, skip = 0, userId, userRole } = req.query;
  
  let query = {};
  
  // If candidate, only show their own resumes
  if (userRole === 'candidate' && userId) {
    query.userId = userId;
  }
  // If recruiter, show all resumes (no filter)
  
  const resumes = await Resume.find(query)
    .select('-rawText -embedding')
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .sort({ uploadedAt: -1 });

  const total = await Resume.countDocuments(query);

  return successResponse(res, 200, 'Resumes retrieved successfully', {
    resumes,
    total,
    limit: parseInt(limit),
    skip: parseInt(skip)
  });
}));

/**
 * @route   GET /api/resume/:id
 * @desc    Get resume by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  return successResponse(res, 200, 'Resume retrieved successfully', resume);
}));

/**
 * @route   POST /api/resume/search
 * @desc    Search resumes using job description (RAG)
 * @access  Public
 */
router.post('/search', asyncHandler(async (req, res) => {
  const { jobDescription, limit = 10 } = req.body;

  if (!jobDescription) {
    return errorResponse(res, 400, 'Job description is required');
  }

  // Get all resumes with embeddings
  const allResumes = await Resume.find({ embedding: { $exists: true, $ne: [] } });

  // Search using RAG
  const results = await searchResumes(jobDescription, allResumes, parseInt(limit));

  return successResponse(res, 200, 'Search completed successfully', {
    results,
    total: results.length
  });
}));

/**
 * @route   POST /api/resume/search-by-skills
 * @desc    Search resumes by specific skills
 * @access  Public
 */
router.post('/search-by-skills', asyncHandler(async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return errorResponse(res, 400, 'Skills array is required');
  }

  const allResumes = await Resume.find();
  const results = searchBySkills(skills, allResumes);

  return successResponse(res, 200, 'Skill-based search completed', {
    results: results.slice(0, 20)
  });
}));

/**
 * @route   POST /api/resume/advanced-search
 * @desc    Advanced search with multiple filters
 * @access  Public
 */
router.post('/advanced-search', asyncHandler(async (req, res) => {
  const filters = req.body;

  const allResumes = await Resume.find({ embedding: { $exists: true, $ne: [] } });
  const results = await advancedSearch(filters, allResumes);

  return successResponse(res, 200, 'Advanced search completed', {
    results
  });
}));

/**
 * @route   POST /api/resume/:id/generate-summary
 * @desc    Generate AI summary for resume
 * @access  Public
 */
router.post('/:id/generate-summary', asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  const summary = await generateResumeSummary(resume);

  return successResponse(res, 200, 'Summary generated successfully', {
    summary
  });
}));

/**
 * @route   POST /api/resume/:id/optimize-keywords
 * @desc    Analyze and optimize resume keywords
 * @access  Public
 */
router.post('/:id/optimize-keywords', asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    return errorResponse(res, 400, 'Job description is required');
  }

  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  // Analyze keywords
  const analysis = analyzeKeywords(resume.rawText, jobDescription);
  const suggestions = generateOptimizationSuggestions(analysis);
  const atsScore = calculateATSScore(resume.rawText, jobDescription);

  return successResponse(res, 200, 'Keyword analysis completed', {
    analysis,
    suggestions,
    atsScore
  });
}));

/**
 * @route   DELETE /api/resume/:id
 * @desc    Delete resume
 * @access  Public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const resume = await Resume.findByIdAndDelete(req.params.id);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  return successResponse(res, 200, 'Resume deleted successfully');
}));

/**
 * @route   GET /api/resume/stats/overview
 * @desc    Get resume statistics
 * @access  Public
 */
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const total = await Resume.countDocuments();
  const recent = await Resume.countDocuments({
    uploadedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  // Get all skills
  const allResumes = await Resume.find().select('skills');
  const allSkills = allResumes.flatMap(r => r.skills);
  const uniqueSkills = [...new Set(allSkills)];

  return successResponse(res, 200, 'Statistics retrieved', {
    totalResumes: total,
    recentResumes: recent,
    uniqueSkills: uniqueSkills.length
  });
}));

export default router;
