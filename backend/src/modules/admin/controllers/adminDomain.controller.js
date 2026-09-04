const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminDomainService = require('../services/adminDomain.service');

class AdminDomainController {
  async listDomains(req, res) {
    const { page, limit, search, status, verificationStatus, sslStatus } = req.query;
    const result = await adminDomainService.listDomains({
      page,
      limit,
      search,
      status,
      verificationStatus,
      sslStatus
    });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Domains retrieved successfully', result));
  }

  async getDomain(req, res) {
    const { id } = req.params;
    const domain = await adminDomainService.getDomain(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Domain retrieved successfully', { domain }));
  }

  async getDomainDNSRecords(req, res) {
    const { id } = req.params;
    const records = await adminDomainService.getDomainDNSRecords(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('DNS records retrieved successfully', { records }));
  }

  async getDomainInstructions(req, res) {
    const { id } = req.params;
    const instructions = await adminDomainService.getDomainInstructions(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Verification instructions retrieved successfully', { instructions }));
  }

  async verifyDomain(req, res) {
    const { id } = req.params;
    const result = await adminDomainService.verifyDomain(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Domain verification check completed', result));
  }

  async updateDomainTarget(req, res) {
    const { id } = req.params;
    const { targetType, targetDeployment } = req.body;
    const domain = await adminDomainService.updateDomainTarget(id, { targetType, targetDeployment });
    return res.status(StatusCodes.OK).json(ApiResponse.success('Domain target updated successfully', { domain }));
  }

  async deleteDomain(req, res) {
    const { id } = req.params;
    await adminDomainService.deleteDomain(id);
    return res.status(StatusCodes.OK).json(ApiResponse.success('Domain deleted successfully'));
  }
}

module.exports = new AdminDomainController();
