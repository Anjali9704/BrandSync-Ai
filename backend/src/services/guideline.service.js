const Guideline = require('../models/guideline.model');
const Asset = require('../models/asset.model');
const Activity = require('../models/activity.model');
const ApiError = require('../utils/ApiError');

class GuidelineService {
  async getGuidelines(query = {}) {
    const filter = {};
    if (query.section && query.section !== 'all') {
      filter.section = query.section;
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
        { items: { $regex: query.search, $options: 'i' } },
      ];
    }

    const guidelines = await Guideline.find(filter).sort({ section: 1, createdAt: 1 });
    return guidelines.map((g) => ({
      id: g._id,
      section: g.section,
      title: g.title,
      content: g.content,
      items: g.items,
      updated_at: g.updatedAt,
      created_at: g.createdAt,
    }));
  }

  async createGuideline(data, user) {
    const guideline = await Guideline.create({
      ...data,
      createdBy: user._id,
    });

    await Activity.create({
      type: 'guideline_updated',
      user: user._id,
      userName: user.name,
      content_title: guideline.title,
      details: { action: 'created', section: guideline.section },
    });

    return {
      id: guideline._id,
      section: guideline.section,
      title: guideline.title,
      content: guideline.content,
      items: guideline.items,
      updated_at: guideline.updatedAt,
      created_at: guideline.createdAt,
    };
  }

  async updateGuideline(id, data, user) {
    const guideline = await Guideline.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!guideline) {
      throw new ApiError(404, 'Guideline not found.');
    }

    await Activity.create({
      type: 'guideline_updated',
      user: user._id,
      userName: user.name,
      content_title: guideline.title,
      details: { action: 'updated', section: guideline.section },
    });

    return {
      id: guideline._id,
      section: guideline.section,
      title: guideline.title,
      content: guideline.content,
      items: guideline.items,
      updated_at: guideline.updatedAt,
      created_at: guideline.createdAt,
    };
  }

  async deleteGuideline(id) {
    const guideline = await Guideline.findByIdAndDelete(id);
    if (!guideline) {
      throw new ApiError(404, 'Guideline not found.');
    }
    return { success: true };
  }

  async getAssets() {
    const assets = await Asset.find().sort({ createdAt: -1 });
    return assets.map((a) => ({
      id: a._id,
      name: a.name,
      type: a.type,
      url: a.url,
      created_at: a.createdAt,
    }));
  }

  async createAsset(data, user) {
    const asset = await Asset.create({
      ...data,
      uploadedBy: user?._id || null,
    });

    return {
      id: asset._id,
      name: asset.name,
      type: asset.type,
      url: asset.url,
      created_at: asset.createdAt,
    };
  }

  async deleteAsset(id) {
    const asset = await Asset.findByIdAndDelete(id);
    if (!asset) {
      throw new ApiError(404, 'Asset not found.');
    }
    return { success: true };
  }
}

module.exports = new GuidelineService();

