const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/environment');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

class AuthService {
  async register(userData) {
    const existing = await User.findOne({ email: userData.email.toLowerCase() });
    if (existing) {
      throw new ApiError(400, 'User with this email already exists.');
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation: user.organisation,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken(user._id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation: user.organisation,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'No account found with this email address.');
    }
    return {
      message: 'Password reset instructions have been dispatched to your email address.',
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organisation: user.organisation,
      avatar: user.avatar,
      preferences: user.preferences,
    };
  }

  async updateProfile(userId, { name, organisation }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    if (name) user.name = name.trim();
    if (organisation) user.organisation = organisation.trim();
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organisation: user.organisation,
      preferences: user.preferences,
    };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect.');
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters.');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully.' };
  }

  async updatePreferences(userId, preferences) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    user.preferences = {
      ...user.preferences.toObject(),
      ...preferences,
    };
    await user.save();

    return {
      id: user._id,
      preferences: user.preferences,
    };
  }
}

module.exports = new AuthService();
