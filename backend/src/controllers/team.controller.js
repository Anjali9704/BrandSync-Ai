const teamService = require('../services/team.service');
const asyncHandler = require('../utils/asyncHandler');

const getMembers = asyncHandler(async (req, res) => {
  const members = await teamService.getMembers();
  return res.status(200).json(members);
});

const inviteMember = asyncHandler(async (req, res) => {
  const member = await teamService.inviteMember(req.body);
  return res.status(201).json(member);
});

const updateMember = asyncHandler(async (req, res) => {
  const member = await teamService.updateMember(req.params.id, req.body);
  return res.status(200).json(member);
});

const deleteMember = asyncHandler(async (req, res) => {
  const result = await teamService.deleteMember(req.params.id);
  return res.status(200).json(result);
});

module.exports = {
  getMembers,
  inviteMember,
  updateMember,
  deleteMember,
};

