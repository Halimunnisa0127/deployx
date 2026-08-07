const { z } = require('zod');

const googleCallbackSchema = z.object({
  query: z.object({
    code: z.string().min(1, 'Authorization code is required'),
    state: z.string().min(1, 'State is required'),
    scope: z.string().optional(),
    authuser: z.string().optional(),
    prompt: z.string().optional(),
  }),
});

module.exports = {
  googleCallbackSchema,
};
