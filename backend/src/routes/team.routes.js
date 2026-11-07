const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const validate = require('../middlewares/validation.middleware');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');
const {
  inviteMemberSchema,
  updateMemberSchema,
} = require('../validators/team.validator');

router.use(verifyJWT);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/', teamController.getMembers);
router.post('/', validate(inviteMemberSchema), teamController.inviteMember);
router.put('/:id', validate(updateMemberSchema), teamController.updateMember);
router.delete('/:id', teamController.deleteMember);

module.exports = router;

