const express = require('express');
const userController = require('../controllers/user.controller');
const { updateProfileSchema, updatePasswordSchema } = require('../validators/user.validator');
const validate = require('../../../shared/validators/validate');
const { authenticate } = require('../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../utils/index');

const router = express.Router();

router.use(authenticate);

router.get('/me', asyncHandler(userController.getProfile));
router.patch('/me', validate(updateProfileSchema), asyncHandler(userController.updateProfile));
router.patch('/password', validate(updatePasswordSchema), asyncHandler(userController.updatePassword));
router.post('/me/avatar', asyncHandler(userController.uploadAvatar));

module.exports = router;
