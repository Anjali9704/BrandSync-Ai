const mongoose = require('mongoose');
const { GUIDELINE_SECTIONS } = require('../constants');

const guidelineSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: [true, 'Section is required'],
      enum: GUIDELINE_SECTIONS,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    items: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

guidelineSchema.index({ title: 'text', content: 'text', items: 'text' });

const Guideline = mongoose.model('Guideline', guidelineSchema);
module.exports = Guideline;

