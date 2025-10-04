/**
 * Resume Model
 * MongoDB schema for storing resume data
 */

import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  // User who uploaded this resume
  userId: {
    type: String,
    required: true,
    index: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  uploaderEmail: {
    type: String,
    required: true
  },
  // Resume details
  filename: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true,
    index: true
  },
  phone: {
    type: String
  },
  skills: [{
    type: String
  }],
  education: [{
    type: String
  }],
  rawText: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number
  },
  embedding: [{
    type: Number
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for text search
resumeSchema.index({ name: 'text', rawText: 'text', skills: 'text' });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
