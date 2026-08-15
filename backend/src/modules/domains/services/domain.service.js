const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const Domain = require('../models/Domain');
const Project = require('../../projects/models/Project');
const Deployment = require('../../deployments/models/Deployment');
const ApiError = require('../../../shared/errors/ApiError');

class DomainService {
  /**
   * Helper to normalize and validate hostname strictly.
   */
  static validateAndNormalizeHostname(hostname) {
    if (!hostname || typeof hostname !== 'string') {
      throw new ApiError('Hostname is required and must be a string', StatusCodes.BAD_REQUEST);
    }

    let normalized = hostname.trim().toLowerCase();

    // Remove trailing dot if exists
    if (normalized.endsWith('.')) {
      normalized = normalized.slice(0, -1);
    }

    // Reject protocols
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.includes('://')) {
      throw new ApiError('Hostname must not include protocols', StatusCodes.BAD_REQUEST);
    }

    // Reject paths, queries, fragments, ports
    if (normalized.includes('/') || normalized.includes('?') || normalized.includes('#') || normalized.includes(':')) {
      throw new ApiError('Hostname must not include ports, paths, query parameters, or fragments', StatusCodes.BAD_REQUEST);
    }

    // Reject whitespace
    if (/\s/.test(normalized)) {
      throw new ApiError('Hostname must not contain whitespace', StatusCodes.BAD_REQUEST);
    }

    // Reject null bytes
    if (normalized.includes('\0')) {
      throw new ApiError('Hostname must not contain null bytes', StatusCodes.BAD_REQUEST);
    }

    // Reject localhost
    if (normalized === 'localhost') {
      throw new ApiError('Localhost is not allowed', StatusCodes.BAD_REQUEST);
    }

    // Reject wildcard
    if (normalized.includes('*')) {
      throw new ApiError('Wildcard domains are not supported', StatusCodes.BAD_REQUEST);
    }

    // Standard domain regex check
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
    if (!domainRegex.test(normalized)) {
      throw new ApiError('Invalid domain name format', StatusCodes.BAD_REQUEST);
    }

    // Reject private/internal IPs or loopback IPs
    if (
      normalized === '127.0.0.1' ||
      normalized.startsWith('10.') ||
      normalized.startsWith('192.168.') ||
      normalized.startsWith('172.16.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(normalized)
    ) {
      throw new ApiError('Internal or private IP addresses are not allowed', StatusCodes.BAD_REQUEST);
    }

    return normalized;
  }

  /**
   * Create a new custom domain mapping
   */
  static async createDomain(userId, projectId, rawHostname) {
    // 1. Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }

    // 2. Verify project ownership
    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this project', StatusCodes.FORBIDDEN);
    }

    // 3. Normalize & validate hostname
    const hostname = this.validateAndNormalizeHostname(rawHostname);

    // 4. Check for duplicate registration database-wide (to be safe before save)
    const existing = await Domain.findOne({ hostname });
    if (existing) {
      throw new ApiError('Hostname is already registered on a project', StatusCodes.CONFLICT);
    }

    // 5. Generate secure verification token
    const verificationToken = `deployx-verify-${crypto.randomBytes(32).toString('hex')}`;

    // 6. Save new domain record
    try {
      const domain = await Domain.create({
        project: projectId,
        owner: userId,
        hostname,
        verificationToken,
        verificationStatus: 'pending',
        status: 'pending',
        sslStatus: 'not_configured',
        targetType: 'production',
        targetDeployment: null
      });

      return domain;
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError('Hostname is already registered on a project', StatusCodes.CONFLICT);
      }
      throw error;
    }
  }

  /**
   * List all domains for a project
   */
  static async getProjectDomains(userId, projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }

    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this project', StatusCodes.FORBIDDEN);
    }

    // Return domains with select to exclude verificationToken in normal list responses
    const domains = await Domain.find({ project: projectId }).select('-verificationToken');
    return domains;
  }

  /**
   * Get specific domain details (excludes token for security)
   */
  static async getDomain(userId, domainId) {
    const domain = await Domain.findById(domainId).select('-verificationToken');
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    if (domain.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this domain', StatusCodes.FORBIDDEN);
    }

    return domain;
  }

  /**
   * Get custom DNS verification instructions (explicitly returns token to owner)
   */
  static async getDomainInstructions(userId, domainId) {
    const domain = await Domain.findById(domainId);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    if (domain.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this domain', StatusCodes.FORBIDDEN);
    }

    return {
      hostname: domain.hostname,
      type: 'TXT',
      name: domain.hostname,
      value: `deployx-verification=${domain.verificationToken}`,
      token: domain.verificationToken,
    };
  }

  /**
   * Delete a custom domain mapping
   */
  static async deleteDomain(userId, domainId) {
    const domain = await Domain.findById(domainId);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    if (domain.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this domain', StatusCodes.FORBIDDEN);
    }

    await Domain.findByIdAndDelete(domainId);
    return { success: true };
  }

  /**
   * Update domain target settings (production or explicit deployment target).
   */
  static async updateDomainTarget(userId, domainId, { targetType, targetDeployment }) {
    const domain = await Domain.findById(domainId);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    if (domain.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this domain', StatusCodes.FORBIDDEN);
    }

    if (targetType === 'deployment') {
      const deployment = await Deployment.findById(targetDeployment);
      if (!deployment) {
        throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
      }

      if (deployment.project.toString() !== domain.project.toString()) {
        throw new ApiError('Deployment does not belong to this project', StatusCodes.BAD_REQUEST);
      }

      if (deployment.status !== 'ready' || !deployment.artifact) {
        throw new ApiError('Only ready deployments with artifacts can be targeted', StatusCodes.BAD_REQUEST);
      }

      domain.targetType = 'deployment';
      domain.targetDeployment = targetDeployment;
    } else {
      domain.targetType = 'production';
      domain.targetDeployment = null;
    }

    await domain.save();
    return domain;
  }
}

module.exports = DomainService;
