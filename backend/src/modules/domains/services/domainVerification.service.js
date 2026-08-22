const dns = require('dns').promises;
const Domain = require('../models/Domain');
const ApiError = require('../../../shared/errors/ApiError');
const { StatusCodes } = require('http-status-codes');
const config = require('../../../config/env/env');

class DomainVerificationService {
  /**
   * Performs real DNS resolution and verifies ownership token on TXT record.
   */
  static async verifyDomain(domainId, userId) {
    const domain = await Domain.findById(domainId);
    if (!domain) {
      throw new ApiError('Domain not found', StatusCodes.NOT_FOUND);
    }

    if (domain.owner.toString() !== userId.toString()) {
      throw new ApiError('Not authorized to access this domain', StatusCodes.FORBIDDEN);
    }

    if (domain.status === 'disabled') {
      throw new ApiError('Verification is rejected because the domain is disabled', StatusCodes.BAD_REQUEST);
    }

    // Idempotency: Return success without resetting timestamps or running queries
    if (domain.verificationStatus === 'verified') {
      return {
        verified: true,
        verificationStatus: 'verified',
        message: 'Domain is already verified.'
      };
    }

    const expectedToken = domain.verificationToken;
    const expectedRecordValue = `deployx-verification=${expectedToken}`;
    const hostname = domain.hostname;

    try {
      let matched = false;
      // Local development shortcut applies strictly when in development environment AND hostname ends with .deployx.app
      const isLocalDevShortcut = config.isDevelopment && hostname.endsWith('.deployx.app');

      if (isLocalDevShortcut) {
        matched = true;
      } else {
        const records = await dns.resolveTxt(hostname);
        const flatRecords = records.map(chunks => chunks.join('')).map(val => val.trim());
        matched = flatRecords.includes(expectedRecordValue);
      }

      if (matched) {
        domain.verificationStatus = 'verified';
        domain.status = 'active';
        domain.verifiedAt = new Date();
        await domain.save();

        return {
          verified: true,
          verificationStatus: 'verified',
          message: 'DNS verification completed successfully.'
        };
      } else {
        domain.verificationStatus = 'failed';
        await domain.save();

        return {
          verified: false,
          verificationStatus: 'failed',
          message: 'DNS verification record was not found.'
        };
      }
    } catch (error) {
      console.warn(`[DNS Verification] Error resolving TXT for ${hostname}:`, error.message);
      
      domain.verificationStatus = 'failed';
      await domain.save();

      // Return a safe message without raw stack traces or internal logs
      let message = 'DNS verification could not be completed. Please try again.';
      if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
        message = 'DNS verification record was not found.';
      }

      return {
        verified: false,
        verificationStatus: 'failed',
        message
      };
    }
  }
}

module.exports = DomainVerificationService;
