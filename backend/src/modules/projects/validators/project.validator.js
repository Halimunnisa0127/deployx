const { z } = require('zod');

// Step 1: Validate Project Name & Check Availability
const checkProjectNameSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Project name is required' })
      .min(2, 'Project name must be at least 2 characters')
      .max(50, 'Project name cannot exceed 50 characters')
      .regex(/^[a-zA-Z0-9-_]+$/, 'Project name can only contain letters, numbers, hyphens, and underscores'),
  })
});

// Full Project Creation Schema
const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Project name is required' })
      .min(2, 'Project name must be at least 2 characters')
      .max(50, 'Project name cannot exceed 50 characters')
      .regex(/^[a-zA-Z0-9-_]+$/, 'Project name can only contain letters, numbers, hyphens, and underscores'),
    framework: z.string().optional().default('auto'),
    branch: z.string().optional().default('main'),
    gitRepository: z
      .object({
        url: z.string().optional(),
        fullName: z.string().optional(),
        branch: z.string().optional(),
        provider: z.enum(['github', 'gitlab', 'bitbucket', 'manual']).optional(),
      })
      .optional(),
    rootDirectory: z.string().optional().default('/'),
    region: z.string().optional().default('auto'),
    buildSettings: z
      .object({
        packageManager: z.string().optional().default('npm'),
        installCommand: z.string().optional().default('npm install'),
        buildCommand: z.string().optional().default('npm run build'),
        outputDirectory: z.string().optional().default('dist'),
        nodeVersion: z.string().optional().default('20.x'),
      })
      .optional(),
    environmentVariables: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
          environments: z.array(z.string()).optional(),
        })
      )
      .optional(),
  })
});

module.exports = {
  checkProjectNameSchema,
  createProjectSchema,
};
