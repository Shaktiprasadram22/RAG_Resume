/**
 * Dashboard Routes
 * Provides analytics and dashboard data
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse } from '../utils/responseHelper.js';
import {
  getDashboardStats,
  getTopSkills,
  getResumeSubmissionTrend,
  getJobStats,
  getEducationDistribution,
  getComprehensiveAnalytics,
  getMockAnalytics
} from '../modules/InteractiveDashboard.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard overview statistics
 * @access  Public
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const resumes = await Resume.find();
  const jobs = await Job.find();

  const stats = getDashboardStats(resumes, jobs);

  return successResponse(res, 200, 'Dashboard stats retrieved', stats);
}));

/**
 * @route   GET /api/dashboard/top-skills
 * @desc    Get top skills across all resumes
 * @access  Public
 */
router.get('/top-skills', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const resumes = await Resume.find().select('skills');
  const topSkills = getTopSkills(resumes, parseInt(limit));

  return successResponse(res, 200, 'Top skills retrieved', {
    topSkills
  });
}));

/**
 * @route   GET /api/dashboard/submission-trend
 * @desc    Get resume submission trend
 * @access  Public
 */
router.get('/submission-trend', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const resumes = await Resume.find().select('uploadedAt');
  const trend = getResumeSubmissionTrend(resumes, parseInt(days));

  return successResponse(res, 200, 'Submission trend retrieved', {
    trend,
    days: parseInt(days)
  });
}));

/**
 * @route   GET /api/dashboard/job-stats
 * @desc    Get job statistics
 * @access  Public
 */
router.get('/job-stats', asyncHandler(async (req, res) => {
  const jobs = await Job.find();
  const jobStats = getJobStats(jobs);

  return successResponse(res, 200, 'Job statistics retrieved', jobStats);
}));

/**
 * @route   GET /api/dashboard/education-distribution
 * @desc    Get education level distribution
 * @access  Public
 */
router.get('/education-distribution', asyncHandler(async (req, res) => {
  const resumes = await Resume.find().select('education');
  const distribution = getEducationDistribution(resumes);

  return successResponse(res, 200, 'Education distribution retrieved', {
    distribution
  });
}));

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get comprehensive analytics
 * @access  Public
 */
router.get('/analytics', asyncHandler(async (req, res) => {
  const resumes = await Resume.find();
  const jobs = await Job.find();

  const analytics = getComprehensiveAnalytics({
    resumes,
    jobs,
    matches: [] // Add match tracking if needed
  });

  return successResponse(res, 200, 'Comprehensive analytics retrieved', analytics);
}));

/**
 * @route   GET /api/dashboard/mock
 * @desc    Get mock analytics data for demo
 * @access  Public
 */
router.get('/mock', asyncHandler(async (req, res) => {
  const mockData = getMockAnalytics();

  return successResponse(res, 200, 'Mock analytics retrieved', mockData);
}));

export default router;
