const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createDeploymentSchema = z.object({
  body: z.object({
    projectId: z.string().regex(objectIdRegex, 'Invalid Project ID format'),
    environment: z.enum(['Production', 'Preview', 'Development']).optional().default('Production'),
    branch: z.string().optional(),
    commitHash: z.string().optional(),
    commitMessage: z.string().optional(),
  }),
});

const projectIdParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, 'Invalid Project ID format'),
  }),
});

const deploymentIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Deployment ID format'),
  }),
});

module.exports = {
  createDeploymentSchema,
  projectIdParamSchema,
  deploymentIdParamSchema,
};
