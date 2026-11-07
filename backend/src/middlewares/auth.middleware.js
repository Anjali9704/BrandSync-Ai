const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token =
      req.cookies?.accessToken ||
      (authHeader && authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null);

    if (!token) {
      throw new ApiError(401, 'Unauthorized request. No token provided.');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Invalid access token. User not found.');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account is inactive. Please contact your administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid authentication token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token has expired. Please sign in again.'));
    }
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden. Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

module.exports = { verifyJWT, authorizeRoles };

