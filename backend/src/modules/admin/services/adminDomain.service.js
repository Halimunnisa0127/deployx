const Domain = require('../../domains/models/Domain');
const Project = require('../../projects/models/Project');
const Deployment = require('../../deployments/models/Deployment');
const DomainVerificationService = require('../../domains/services/domainVerification.service');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../../shared/errors/ApiError');
const config = require('../../../config/env/env');

class AdminDomainService {
  /**
   * List all platform domains with pagination, search, and status filters.
   */
  static async listDomains({ page = 1, limit = 50, search = '', status = '', verificationStatus = '', sslStatus = '' }) {
    const query = {};

    if (verificationStatus && verificationStatus !== 'all') {
      query.verificationStatus = verificationStatus;
    }

    if (sslStatus && sslStatus !== 'all') {
      query.sslStatus = sslStatus;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.hostname = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const total = await Domain.countDocuments(query);
    const domains = await Domain.find(query)
      .populate('project', 'name slug framework domainUrl')
      .populate('owner', 'fullName email')
      .populate('targetDeployment', 'deploymentNumber environment status')
      .select('-verificationToken') // Never leak verification tokens in bulk list
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const mappedDomains = domains.map(d => {
      const environment = d.targetType === 'deployment' ? 'preview' : 'production';
      const isDeployXManaged = d.hostname.endsWith('.deployx.app');

      return {
        id: d._id,
        _id: d._id,
        name: d.hostname,
        hostname: d.hostname,
        project: d.project ? d.project.name : 'Unknown',
        projectId: d.project ? d.project._id : null,
        owner: d.owner ? d.owner.fullName : 'Unknown',
        ownerEmail: d.owner ? d.owner.email : '',
        environment,
        targetType: d.targetType || 'production',
        targetDeploymentId: d.targetDeployment ? d.targetDeployment._id : null,
        targetDeploymentNumber: d.targetDeployment ? d.targetDeployment.deploymentNumber : null,
        verificationStatus: d.verificationStatus || 'pending',
        sslStatus: d.sslStatus || 'not_configured',
        status: d.status || 'pending',
        provider: isDeployXManaged ? 'DeployX Managed' : 'Custom DNS',
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        lastVerified: d.verifiedAt || null,
      };
    });

    return {
      domains: mappedDomains,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get single domain details.
   */
  static async getDomain(id) {
    const d = await Domain.findById(id)
      .populate('project', 'name slug framework domainUrl')
      .populate('owner', 'fullName email')
      .populate('targetDeployment', 'deploymentNumber environment status')
      .select('-verificationToken');

    if (!d) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    const environment = d.targetType === 'deployment' ? 'preview' : 'production';
    const isDeployXManaged = d.hostname.endsWith('.deployx.app');

    return {
      id: d._id,
      _id: d._id,
      name: d.hostname,
      hostname: d.hostname,
      project: d.project ? d.project.name : 'Unknown',
      projectId: d.project ? d.project._id : null,
      owner: d.owner ? d.owner.fullName : 'Unknown',
      ownerEmail: d.owner ? d.owner.email : '',
      environment,
      targetType: d.targetType || 'production',
      targetDeploymentId: d.targetDeployment ? d.targetDeployment._id : null,
      targetDeploymentNumber: d.targetDeployment ? d.targetDeployment.deploymentNumber : null,
      verificationStatus: d.verificationStatus || 'pending',
      sslStatus: d.sslStatus || 'not_configured',
      status: d.status || 'pending',
      provider: isDeployXManaged ? 'DeployX Managed' : 'Custom DNS',
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      lastVerified: d.verifiedAt || null,
    };
  }

  /**
   * Get DNS records for a domain (real dynamic values based on config).
   */
  static async getDomainDNSRecords(id) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    const isVerified = domain.verificationStatus === 'verified';
    const isSubdomain = domain.hostname.split('.').length > 2;

    const routerIp = config.domains?.routerIp || '76.76.21.21';
    const cnameTarget = config.domains?.cnameTarget || `cname.${config.appBaseDomain || 'deployx.app'}`;

    const records = [];

    if (isSubdomain) {
      const subPrefix = domain.hostname.split('.')[0];
      records.push({
        type: 'CNAME',
        name: subPrefix,
        value: cnameTarget,
        status: isVerified ? 'valid' : 'pending',
      });
    } else {
      records.push({
        type: 'A',
        name: '@',
        value: routerIp,
        status: isVerified ? 'valid' : 'pending',
      });
      records.push({
        type: 'CNAME',
        name: 'www',
        value: cnameTarget,
        status: isVerified ? 'valid' : 'pending',
      });
    }

    return records;
  }

  /**
   * Get custom DNS verification instructions (explicit authorized operation).
   */
  static async getDomainInstructions(id) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    const routerIp = config.domains?.routerIp || '76.76.21.21';
    const cnameTarget = config.domains?.cnameTarget || `cname.${config.appBaseDomain || 'deployx.app'}`;

    return {
      hostname: domain.hostname,
      type: 'TXT',
      name: domain.hostname,
      value: `deployx-verification=${domain.verificationToken}`,
      token: domain.verificationToken,
      cnameTarget,
      routerIp,
    };
  }

  /**
   * Verify domain DNS configuration via real resolver.
   */
  static async verifyDomain(id) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    // Call domain verification service with the domain owner's id
    return await DomainVerificationService.verifyDomain(id, domain.owner);
  }

  /**
   * Update domain target settings.
   */
  static async updateDomainTarget(id, { targetType, targetDeployment }) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
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

  /**
   * Delete a custom domain mapping.
   */
  static async deleteDomain(id) {
    const domain = await Domain.findById(id);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    await Domain.deleteOne({ _id: id });
    return { success: true };
  }
}

module.exports = AdminDomainService;
