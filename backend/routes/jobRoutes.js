/**
 * Job Routes
 * Handles all job-related endpoints
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse, createdResponse } from '../utils/responseHelper.js';
import { 
  getJobRecommendations, 
  findCandidatesForJob, 
  generateJobEmbedding,
  getMatchExplanation 
} from '../modules/JobMatchRecommendation.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';

const router = express.Router();

/**
 * @route   POST /api/jobs
 * @desc    Create new job posting
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
  const jobData = req.body;

  // Validate required fields
  if (!jobData.title || !jobData.company || !jobData.description) {
    return errorResponse(res, 400, 'Title, company, and description are required');
  }

  // Generate embedding for the job
  const jobWithEmbedding = await generateJobEmbedding(jobData);

  // Create job
  const job = new Job(jobWithEmbedding);
  await job.save();

  return createdResponse(res, 'Job posted successfully', job);
}));

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const { status, limit = 50, skip = 0 } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const jobs = await Job.find(filter)
    .select('-embedding')
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .sort({ postedAt: -1 });

  const total = await Job.countDocuments(filter);

  return successResponse(res, 200, 'Jobs retrieved successfully', {
    jobs,
    total,
    limit: parseInt(limit),
    skip: parseInt(skip)
  });
}));

/**
 * @route   GET /api/jobs/:id
 * @desc    Get job by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return errorResponse(res, 404, 'Job not found');
  }

  return successResponse(res, 200, 'Job retrieved successfully', job);
}));

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job posting
 * @access  Public
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return errorResponse(res, 404, 'Job not found');
  }

  return successResponse(res, 200, 'Job updated successfully', job);
}));

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job posting
 * @access  Public
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return errorResponse(res, 404, 'Job not found');
  }

  return successResponse(res, 200, 'Job deleted successfully');
}));

/**
 * @route   POST /api/jobs/:id/find-candidates
 * @desc    Find matching candidates for a job
 * @access  Public
 */
router.post('/:id/find-candidates', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.body;

  const job = await Job.findById(req.params.id);

  if (!job) {
    return errorResponse(res, 404, 'Job not found');
  }

  // Get all resumes
  const resumes = await Resume.find({ embedding: { $exists: true, $ne: [] } });

  // Find matching candidates
  const candidates = await findCandidatesForJob(job, resumes, parseInt(limit));

  return successResponse(res, 200, 'Candidates found successfully', {
    jobTitle: job.title,
    candidates
  });
}));

/**
 * @route   POST /api/jobs/recommend
 * @desc    Get job recommendations for a candidate
 * @access  Public
 */
router.post('/recommend', asyncHandler(async (req, res) => {
  const { resumeId, limit = 5 } = req.body;

  if (!resumeId) {
    return errorResponse(res, 400, 'Resume ID is required');
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  // Get active jobs
  const jobs = await Job.find({ 
    status: 'active',
    embedding: { $exists: true, $ne: [] }
  });

  // Get recommendations
  const recommendations = await getJobRecommendations(resume, jobs, parseInt(limit));

  // Add explanations
  const recommendationsWithExplanations = recommendations.map(rec => ({
    ...rec,
    explanation: getMatchExplanation(rec)
  }));

  return successResponse(res, 200, 'Job recommendations generated', {
    candidateName: resume.name,
    recommendations: recommendationsWithExplanations
  });
}));

/**
 * @route   GET /api/jobs/stats/overview
 * @desc    Get job statistics
 * @access  Public
 */
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const total = await Job.countDocuments();
  const active = await Job.countDocuments({ status: 'active' });
  const closed = await Job.countDocuments({ status: 'closed' });

  // Top companies
  const topCompanies = await Job.aggregate([
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  return successResponse(res, 200, 'Job statistics retrieved', {
    total,
    active,
    closed,
    topCompanies
  });
}));

export default router;
