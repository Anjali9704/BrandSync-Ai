const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return res.status(200).json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return res.status(200).json(result);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  return res.status(200).json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return res.status(200).json(user);
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user._id, req.body);
  return res.status(200).json(result);
});

const updatePreferences = asyncHandler(async (req, res) => {
  const result = await authService.updatePreferences(req.user._id, req.body);
  return res.status(200).json(result);
});

module.exports = {
  register,
  login,
  forgotPassword,
  getMe,
  updateProfile,
  changePassword,
  updatePreferences,
};
