const Project = require('../models/Project');
const EncryptionUtil = require('../../../shared/utils/encryption.util');

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
   * Helper to mask sensitive environment variables for safe client consumption
   */
  static maskEnvironmentVariables(project) {
    if (!project) return project;
    const projectObj = project.toObject ? project.toObject() : { ...project };
    if (projectObj.environmentVariables && Array.isArray(projectObj.environmentVariables)) {
      projectObj.environmentVariables = projectObj.environmentVariables.map((env) => {
        // Strip out encryption metadata explicitly
        const { iv, authTag, isEncrypted, ...safeEnv } = env.toObject ? env.toObject() : env;
        return {
          ...safeEnv,
          value: '********',
        };
      });
    }
    return projectObj;
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

    let encryptedEnvVars = [];
    if (data.environmentVariables) {
      encryptedEnvVars = data.environmentVariables.map(env => {
        if (!env.value) return env;
        const encrypted = EncryptionUtil.encrypt(env.value);
        return {
          key: env.key,
          value: encrypted.ciphertext,
          isEncrypted: true,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          environments: env.environments
        };
      });
    }

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
      environmentVariables: encryptedEnvVars,
      status: 'building',
      stepCompleted: 6,
    });

    return this.maskEnvironmentVariables(project);
  }

  /**
   * List all projects for a user
   */
  static async getUserProjects(userId) {
    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });
    return projects.map((p) => this.maskEnvironmentVariables(p));
  }

  /**
   * Get project by ID
   */
  static async getProjectById(userId, projectId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      throw new Error('Project not found');
    }
    return this.maskEnvironmentVariables(project);
  }

  /**
   * Update project (Partial update via whitelist)
   */
  static async updateProject(userId, projectId, updateData) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      throw new Error('Project not found');
    }

    // Explicit Whitelist of editable fields
    const whitelist = ['name', 'framework', 'rootDirectory', 'region', 'buildSettings', 'environmentVariables'];
    
    // For environment variables, if the value is '********', keep the old value
    if (updateData.environmentVariables) {
      updateData.environmentVariables = updateData.environmentVariables.map((incomingEnv) => {
        if (incomingEnv.value === '********') {
          // Find original value
          const originalEnv = project.environmentVariables.find(e => e.key === incomingEnv.key);
          if (originalEnv) {
            incomingEnv.value = originalEnv.value;
            incomingEnv.isEncrypted = originalEnv.isEncrypted;
            incomingEnv.iv = originalEnv.iv;
            incomingEnv.authTag = originalEnv.authTag;
          }
        } else {
          // New plaintext value -> encrypt it
          const encrypted = EncryptionUtil.encrypt(incomingEnv.value);
          incomingEnv.value = encrypted.ciphertext;
          incomingEnv.isEncrypted = true;
          incomingEnv.iv = encrypted.iv;
          incomingEnv.authTag = encrypted.authTag;
        }
        return incomingEnv;
      });
    }

    // Apply updates based on whitelist
    whitelist.forEach((field) => {
      if (updateData[field] !== undefined) {
        project[field] = updateData[field];
      }
    });

    // If name changed, we update slug and domainUrl
    if (updateData.name && updateData.name !== project.name) {
      const newSlug = this.generateSlug(updateData.name);
      
      const existing = await Project.findOne({ slug: newSlug, _id: { $ne: projectId } });
      if (existing) {
        throw new Error(`Project with slug '${newSlug}' already exists. Please choose a different name.`);
      }
      
      project.slug = newSlug;
      project.domainUrl = `https://${newSlug}.deployx.app`;
    }

    await project.save();
    return this.maskEnvironmentVariables(project);
  }

  /**
   * Delete project
   */
  static async deleteProject(userId, projectId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) {
      throw new Error('Project not found');
    }

    await Project.deleteOne({ _id: projectId });
    return { id: projectId };
  }
}

module.exports = ProjectService;
