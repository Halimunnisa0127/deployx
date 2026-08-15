const { StatusCodes } = require('http-status-codes');
const domainService = require('../services/domain.service');
const domainVerificationService = require('../services/domainVerification.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');

class DomainController {
  /**
   * Create new custom domain
   */
  async createDomain(req, res) {
    const userId = req.user.id;
    const { projectId, hostname } = req.body;

    const domain = await domainService.createDomain(userId, projectId, hostname);

    res
      .status(StatusCodes.CREATED)
      .json(ApiResponse.success('Custom domain registered successfully', { domain }));
  }

  /**
   * Get all custom domains mapped to a project
   */
  async getProjectDomains(req, res) {
    const userId = req.user.id;
    const { projectId } = req.params;

    const domains = await domainService.getProjectDomains(userId, projectId);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Project domains retrieved successfully', { domains }));
  }

  /**
   * Get specific domain details (excludes token for security)
   */
  async getDomain(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const domain = await domainService.getDomain(userId, id);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Domain details retrieved successfully', { domain }));
  }

  /**
   * Get custom DNS verification instructions (explicitly returns token to owner)
   */
  async getDomainInstructions(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const instructions = await domainService.getDomainInstructions(userId, id);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Verification instructions retrieved successfully', { instructions }));
  }

  /**
   * Delete custom domain
   */
  async deleteDomain(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    await domainService.deleteDomain(userId, id);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Domain deleted successfully'));
  }

  /**
   * Update custom domain routing target
   */
  async updateDomainTarget(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const { targetType, targetDeployment } = req.body;

    const domain = await domainService.updateDomainTarget(userId, id, { targetType, targetDeployment });

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Domain target updated successfully', { domain }));
  }

  /**
   * Verify domain DNS configuration
   */
  async verifyDomain(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    const verificationResult = await domainVerificationService.verifyDomain(id, userId);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Domain verification check completed', verificationResult));
  }
}

module.exports = new DomainController();
