const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

class TeamService {
  async getMembers() {
    const users = await User.find().sort({ createdAt: 1 });
    return users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      organisation: u.organisation,
      joined_at: u.createdAt,
    }));
  }

  async inviteMember(data) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new ApiError(400, 'User with this email already exists in team.');
    }

    const defaultPassword = 'Pass@123';
    const user = await User.create({
      ...data,
      password: defaultPassword,
      status: 'active',
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organisation: user.organisation,
      joined_at: user.createdAt,
    };
  }

  async updateMember(id, data) {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ApiError(404, 'Team member not found.');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organisation: user.organisation,
      joined_at: user.createdAt,
    };
  }

  async deleteMember(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'Team member not found.');
    }
    return { success: true };
  }
}

module.exports = new TeamService();

