const mongoose = require('mongoose');
const { SEVERITIES, ISSUE_TYPES } = require('../constants');

const issueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ISSUE_TYPES,
      required: true,
    },
    severity: {
      type: String,
      enum: SEVERITIES,
      default: 'medium',
    },
    start_index: {
      type: Number,
      required: true,
    },
    end_index: {
      type: Number,
      required: true,
    },
    original_text: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      default: '',
    },
    guideline_ref: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'accepted', 'rejected'],
      default: 'open',
    },
  },
  { _id: true }
);

const analysisSchema = new mongoose.Schema(
  {
    content_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
      index: true,
    },
    compliance_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    brand_consistency_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    tone_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    factual_accuracy_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    summary: {
      type: String,
      default: '',
    },
    issues: [issueSchema],
    corrected_text: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;

