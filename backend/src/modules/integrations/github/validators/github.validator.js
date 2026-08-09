const { z } = require('zod');

exports.callbackSchema = z.object({
  query: z.object({
    code: z.string().min(1, 'OAuth code is required'),
    state: z.string().min(1, 'State is required'),
  }),
});

exports.getRepositoriesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
    sort: z.string().optional(),
    search: z.string().optional(),
    language: z.string().optional(),
    visibility: z.string().optional(),
    owner: z.string().optional(),
  }),
});

exports.getBranchesSchema = z.object({
  params: z.object({
    owner: z.string().min(1, 'Owner is required'),
    repo: z.string().min(1, 'Repository is required'),
  }),
});

exports.analyzeRepositorySchema = z.object({
  params: z.object({
    owner: z.string().min(1, 'Owner is required'),
    repo: z.string().min(1, 'Repository is required'),
  }),
  query: z.object({
    branch: z.string().optional(),
    rootDirectory: z.string().optional().refine(val => {
      if (!val) return true;
      // Reject absolute paths
      if (val.startsWith('/')) return false;
      // Reject paths navigating upwards
      if (val.includes('..')) return false;
      return true;
    }, 'Invalid root directory'),
  }),
});
