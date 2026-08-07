const express = require('express');
const googleAuthController = require('../controllers/googleAuth.controller');
const { googleCallbackSchema } = require('../validators/googleAuth.validator');
const validate = require('../../../../shared/validators/validate');
const { authenticate, optionalAuth } = require('../../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../../utils');

const router = express.Router();

router.get('/oauth/connect', optionalAuth, asyncHandler(googleAuthController.connect));
router.get('/oauth/callback', optionalAuth, validate(googleCallbackSchema), asyncHandler(googleAuthController.callback));
router.delete('/disconnect', authenticate, asyncHandler(googleAuthController.disconnect));

module.exports = router;
