const { z } = require('zod');

const createDeploymentSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, 'Project ID is required'),
    environment: z.enum(['Production', 'Preview', 'Development']).optional().default('Production'),
    branch: z.string().optional(),
    commitHash: z.string().optional(),
    commitMessage: z.string().optional(),
  }),
});

module.exports = {
  createDeploymentSchema,
};
