const { z } = require('zod');
const REGEX_PATTERNS = require('../../../shared/constants/regex.constants');

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(REGEX_PATTERNS.PASSWORD_STRENGTH, 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
