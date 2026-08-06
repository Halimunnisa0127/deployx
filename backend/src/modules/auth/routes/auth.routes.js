const express = require('express');
const authController = require('../controllers/auth.controller');
const { validate, registerSchema, loginSchema } = require('../validators/auth.validator');
const { authenticate } = require('../../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
