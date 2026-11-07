const Review = require('../models/review.model');
const Content = require('../models/content.model');
const Activity = require('../models/activity.model');
const ApiError = require('../utils/ApiError');

class ReviewService {
  async getQueue(status) {
    const filter = {};
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['submitted', 'reviewed', 'pending', 'changes_requested'] };
    }

    const items = await Content.find(filter)
      .sort({ updatedAt: -1 })
      .populate('author', 'name email role')
      .populate('latestAnalysis');

    return items.map((item) => ({
      id: item._id,
      title: item.title,
      body: item.body,
      content_type: item.content_type,
      platform: item.platform,
      status: item.status,
      compliance_score: item.compliance_score,
      author: {
        id: item.author?._id,
        name: item.author?.name || 'Unknown',
      },
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    }));
  }

  async submitReview(contentId, reviewData, user) {
    const content = await Content.findById(contentId);
    if (!content) {
      throw new ApiError(404, 'Content not found.');
    }

    const privilegedRoles = ['admin', 'brand_manager', 'reviewer'];
    if (
      ['approved', 'rejected', 'changes_requested'].includes(reviewData.decision) &&
      !privilegedRoles.includes(user.role)
    ) {
      throw new ApiError(403, 'You do not have permission to approve or reject content.');
    }

    const review = await Review.create({
      content_id: content._id,
      reviewer: user._id,
      decision: reviewData.decision,
      comment: reviewData.comment || '',
      final_text: reviewData.final_text || content.body,
    });

    // Update content status
    content.status = reviewData.decision;
    if (reviewData.final_text) {
      content.body = reviewData.final_text;
    }
    await content.save();

    // Log Activity
    await Activity.create({
      type: reviewData.decision === 'approved' ? 'approved' : reviewData.decision === 'rejected' ? 'rejected' : 'changes_requested',
      user: user._id,
      userName: user.name,
      content_id: content._id,
      content_title: content.title,
      details: { comment: reviewData.comment },
    });

    return {
      success: true,
      decision: reviewData.decision,
      review_id: review._id,
    };
  }

  async getHistory(contentId) {
    const reviews = await Review.find({ content_id: contentId })
      .sort({ createdAt: -1 })
      .populate('reviewer', 'name email role');

    return reviews.map((r) => ({
      id: r._id,
      reviewer: r.reviewer?.name || 'Reviewer',
      decision: r.decision,
      comment: r.comment,
      created_at: r.createdAt,
    }));
  }
}

module.exports = new ReviewService();

