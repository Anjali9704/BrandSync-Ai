const Content = require('../models/content.model');
const Activity = require('../models/activity.model');
const ApiError = require('../utils/ApiError');

class ContentService {
  async createContent(data, user) {
    const content = await Content.create({
      ...data,
      author: user._id,
      status: 'submitted',
    });

    await Activity.create({
      type: 'submitted',
      user: user._id,
      userName: user.name,
      content_id: content._id,
      content_title: content.title,
    });

    return content.populate('author', 'name email role');
  }

  async listContent(query) {
    const {
      search,
      type,
      platform,
      status,
      sort = '-createdAt',
      page = 1,
      page_size = 10,
    } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.content_type = type;
    if (platform) filter.platform = platform;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(page_size);
    const limit = Number(page_size);

    const [items, total] = await Promise.all([
      Content.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email role')
        .populate('latestAnalysis')
        .lean(),
      Content.countDocuments(filter),
    ]);

    // Format for frontend
    const formatted = items.map((item) => ({
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
        email: item.author?.email,
      },
      latestAnalysis: item.latestAnalysis,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    }));

    return {
      items: formatted,
      total,
      page: Number(page),
      page_size: Number(page_size),
    };
  }

  async getContentById(id) {
    const content = await Content.findById(id)
      .populate('author', 'name email role')
      .populate('latestAnalysis');

    if (!content) {
      throw new ApiError(404, 'Content item not found.');
    }

    return content;
  }
}

module.exports = new ContentService();

