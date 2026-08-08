const Project = require('../models/Project');

class ProjectService {
  /**
   * Helper to convert raw project name into domain-friendly slug
   */
  static generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Step 1: Check project name availability and generate domain preview URL
   */
  static async checkProjectNameAvailability(userId, name) {
    const rawSlug = this.generateSlug(name) || 'my-project';
    
    // Check if user already has a project with this exact name or slug
    const existingProject = await Project.findOne({
      $or: [{ name: { $regex: new RegExp(`^${name}$`, 'i') } }, { slug: rawSlug }],
    });

    const isAvailable = !existingProject;
    
    // Generate preview deployment URL matching frontend style (https://slug.deployx.app)
    const previewUrl = `https://${rawSlug}.deployx.app`;

    return {
      name,
      slug: rawSlug,
      available: isAvailable,
      previewUrl,
      message: isAvailable
        ? 'Project name is available'
        : 'A project with this name or slug already exists',
    };
  }

  /**
   * Full project creation step
   */
  static async createProject(userId, data) {
    const slug = this.generateSlug(data.name);

    // Ensure slug uniqueness
    const existing = await Project.findOne({ slug });
    if (existing) {
      throw new Error(`Project with slug '${slug}' already exists. Please choose a different name.`);
    }

    const domainUrl = `https://${slug}.deployx.app`;

    const project = await Project.create({
      name: data.name,
      slug,
      owner: userId,
      domainUrl,
      framework: data.framework || 'auto',
      gitRepository: data.gitRepository || {},
      rootDirectory: data.rootDirectory || '/',
      region: data.region || 'auto',
      buildSettings: data.buildSettings || {},
      environmentVariables: data.environmentVariables || [],
      status: 'building',
      stepCompleted: 6,
    });

    return project;
  }

  /**
   * List all projects for a user
   */
  static async getUserProjects(userId) {
    return Project.find({ owner: userId }).sort({ createdAt: -1 });
  }

  /**
   * Get project by ID
   */
  static async getProjectById(userId, projectId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
}

module.exports = ProjectService;
