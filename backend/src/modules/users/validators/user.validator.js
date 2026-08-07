const { z } = require('zod');
const REGEX_PATTERNS = require('../../../shared/constants/regex.constants');

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    username: z.string().regex(REGEX_PATTERNS.USERNAME, 'Invalid username format').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      timezone: z.string().optional(),
      language: z.string().optional(),
      emailNotifications: z.boolean().optional(),
      marketingEmails: z.boolean().optional(),
    }).optional(),
  }),
});

const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').regex(REGEX_PATTERNS.PASSWORD_STRENGTH, 'Password must be strong'),
  }),
});

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
};
