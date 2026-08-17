const DeploymentLog = require('../models/DeploymentLog');
const LogSequence = require('../models/LogSequence');

// Maximum characters per individual log message
const MAX_LOG_LENGTH = 5000;
// Practical limit: 10,000 logs per deployment
const MAX_LOGS_PER_DEPLOYMENT = 10000;

class DeploymentLogService {
  /**
   * Generates a stable monotonically increasing sequence per deployment.
   */
  static async getNextSequence(deploymentId) {
    const sequenceDoc = await LogSequence.findOneAndUpdate(
      { deployment: deploymentId },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );
    return sequenceDoc.sequence;
  }

  /**
   * Sanitizes Docker output to prevent secret leakage.
   * Redacts known sensitive patterns and injected env variables.
   */
  static sanitizeMessage(message, envVarsToRedact = {}) {
    if (!message) return '';

    let safeMessage = message;

    // 1. Redact injected project variables
    for (const [key, value] of Object.entries(envVarsToRedact)) {
      if (value && value.length > 2) {
        // Simple string replacement for known exact values
        const regex = new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        safeMessage = safeMessage.replace(regex, '[REDACTED]');
      }
    }

    // 2. Redact GitHub tokens (ghp_, github_pat_, or x-access-token matches)
    safeMessage = safeMessage.replace(/ghp_[a-zA-Z0-9]{36}/g, '[REDACTED_TOKEN]');
    safeMessage = safeMessage.replace(/github_pat_[a-zA-Z0-9_]{82}/g, '[REDACTED_TOKEN]');
    safeMessage = safeMessage.replace(/x-access-token:[^\s@]+@/g, 'x-access-token:[REDACTED_TOKEN]@');
    
    // 3. Redact common authorization headers if accidentally printed
    safeMessage = safeMessage.replace(/(Authorization:\s*Bearer\s+)[^\s]+/gi, '$1[REDACTED]');

    return safeMessage;
  }

  /**
   * Creates a log entry with redaction and truncation protections.
   */
  static async appendLog(deploymentId, projectId, level, rawMessage, envVarsToRedact = {}) {
    try {
      // 1. Sanitize
      let message = this.sanitizeMessage(rawMessage, envVarsToRedact);

      // 2. Truncate
      if (message.length > MAX_LOG_LENGTH) {
        message = message.substring(0, MAX_LOG_LENGTH) + '... [TRUNCATED]';
      }

      // 3. Sequence
      const sequence = await this.getNextSequence(deploymentId);

      // 4. Max logs limit protection
      if (sequence > MAX_LOGS_PER_DEPLOYMENT) {
        if (sequence === MAX_LOGS_PER_DEPLOYMENT + 1) {
          // Add one final log stating the limit was reached
          await DeploymentLog.create({
            deployment: deploymentId,
            project: projectId,
            level: 'warning',
            message: 'Maximum log limit reached for this deployment. Further logs will be dropped.',
            sequence,
          });
        }
        return; // Drop subsequent logs
      }

      // 5. Persist
      await DeploymentLog.create({
        deployment: deploymentId,
        project: projectId,
        level,
        message,
        sequence,
      });

    } catch (error) {
      // Safe internal warning - do not throw to crash the build worker
      console.warn(`[LogService] Failed to append log for deployment ${deploymentId}. Safe Internal Error.`);
    }
  }

  /**
   * Retrieves deployment logs with pagination.
   */
  static async getDeploymentLogs(deploymentId, page = 1, limit = 100) {
    const skip = (page - 1) * limit;
    
    const logs = await DeploymentLog.find({ deployment: deploymentId })
      .sort({ sequence: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await DeploymentLog.countDocuments({ deployment: deploymentId });

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}

module.exports = DeploymentLogService;
