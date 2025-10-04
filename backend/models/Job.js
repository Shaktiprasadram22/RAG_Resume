/**
 * Job Model
 * MongoDB schema for storing job postings
 */

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead', 'any'],
    default: 'any'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'active'
  },
  embedding: [{
    type: Number
  }],
  postedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for searching
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ status: 1, postedAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
