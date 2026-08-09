const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createDomainSchema = z.object({
  body: z.object({
    projectId: z.string().regex(objectIdRegex, 'Invalid Project ID format'),
    hostname: z.string().min(1, 'Hostname is required'),
  }),
});

const getProjectDomainsSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, 'Invalid Project ID format'),
  }),
});

const domainIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Domain ID format'),
  }),
});

const updateDomainTargetSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Domain ID format'),
  }),
  body: z.object({
    targetType: z.enum(['production', 'deployment']),
    targetDeployment: z.string().regex(objectIdRegex, 'Invalid Deployment ID format').optional(),
  }).refine(data => {
    if (data.targetType === 'deployment' && !data.targetDeployment) {
      return false;
    }
    return true;
  }, {
    message: 'targetDeployment is required when targetType is "deployment"',
    path: ['targetDeployment'],
  }),
});

module.exports = {
  createDomainSchema,
  getProjectDomainsSchema,
  domainIdParamSchema,
  updateDomainTargetSchema,
};
