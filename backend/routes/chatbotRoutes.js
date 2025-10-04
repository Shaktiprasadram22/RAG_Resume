/**
 * Chatbot Routes
 * Handles RAG chatbot interactions
 */

import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import {
  processChatMessage,
  chatSearchResumes,
  answerResumeQuestion,
  getCareerAdvice,
  suggestInterviewQuestions,
  classifyIntent,
  getGreeting
} from '../modules/RAGChatbot.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';

const router = express.Router();

/**
 * @route   POST /api/chatbot/message
 * @desc    Send message to chatbot
 * @access  Public
 */
router.post('/message', asyncHandler(async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return errorResponse(res, 400, 'Message is required');
  }

  // Classify intent
  const intent = classifyIntent(message);

  // Get context data
  const resumes = await Resume.find().limit(100);
  const jobs = await Job.find({ status: 'active' }).limit(50);

  const context = {
    resumes,
    jobs,
    intent
  };

  // Process message
  const response = await processChatMessage(message, conversationHistory, context);

  return successResponse(res, 200, 'Message processed', {
    response,
    intent
  });
}));

/**
 * @route   POST /api/chatbot/search
 * @desc    Search resumes via natural language
 * @access  Public
 */
router.post('/search', asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return errorResponse(res, 400, 'Search query is required');
  }

  const resumes = await Resume.find({ embedding: { $exists: true, $ne: [] } });
  const result = await chatSearchResumes(query, resumes);

  return successResponse(res, 200, 'Search completed', result);
}));

/**
 * @route   POST /api/chatbot/resume-question
 * @desc    Ask question about specific resume
 * @access  Public
 */
router.post('/resume-question', asyncHandler(async (req, res) => {
  const { resumeId, question } = req.body;

  if (!resumeId || !question) {
    return errorResponse(res, 400, 'Resume ID and question are required');
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return errorResponse(res, 404, 'Resume not found');
  }

  const answer = await answerResumeQuestion(question, resume);

  return successResponse(res, 200, 'Question answered', {
    question,
    answer
  });
}));

/**
 * @route   POST /api/chatbot/career-advice
 * @desc    Get career advice
 * @access  Public
 */
router.post('/career-advice', asyncHandler(async (req, res) => {
  const { question, resumeId } = req.body;

  if (!question) {
    return errorResponse(res, 400, 'Question is required');
  }

  let userProfile = {};

  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    if (resume) {
      userProfile = {
        skills: resume.skills,
        education: resume.education
      };
    }
  }

  const advice = await getCareerAdvice(question, userProfile);

  return successResponse(res, 200, 'Career advice generated', {
    question,
    advice
  });
}));

/**
 * @route   POST /api/chatbot/interview-questions
 * @desc    Generate interview questions for a job
 * @access  Public
 */
router.post('/interview-questions', asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return errorResponse(res, 400, 'Job ID is required');
  }

  const job = await Job.findById(jobId);

  if (!job) {
    return errorResponse(res, 404, 'Job not found');
  }

  const questions = await suggestInterviewQuestions(job);

  return successResponse(res, 200, 'Interview questions generated', {
    jobTitle: job.title,
    questions
  });
}));

/**
 * @route   GET /api/chatbot/greeting
 * @desc    Get greeting message
 * @access  Public
 */
router.get('/greeting', asyncHandler(async (req, res) => {
  const greeting = getGreeting();

  return successResponse(res, 200, 'Greeting retrieved', {
    message: greeting
  });
}));

export default router;
