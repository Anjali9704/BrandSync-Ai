const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    content_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    decision: {
      type: String,
      enum: ['approved', 'rejected', 'changes_requested', 'pending'],
      required: true,
      index: true,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    final_text: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

