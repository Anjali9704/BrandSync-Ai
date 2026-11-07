const mongoose = require('mongoose');
const { CONTENT_TYPES, PLATFORMS, CONTENT_STATUSES } = require('../constants');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    body: {
      type: String,
      required: [true, 'Content body is required'],
      trim: true,
    },
    content_type: {
      type: String,
      enum: CONTENT_TYPES,
      default: 'social_post',
      index: true,
    },
    platform: {
      type: String,
      enum: PLATFORMS,
      default: 'linkedin',
      index: true,
    },
    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: 'submitted',
      index: true,
    },
    compliance_score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    latestAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ title: 'text', body: 'text' });

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;

