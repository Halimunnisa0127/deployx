const crypto = require('crypto');
const config = require('../../config/env/env');
const { ENCRYPTION_VERSION } = require('../../modules/integrations/github/constants/github.constants');

const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts a string using AES-256-GCM.
 * @param {string} text - The text to encrypt.
 * @returns {object} Object containing encryptedData, iv, authTag, and version.
 */
exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(config.github.encryptionKey, 'hex'); // Assuming the key is provided as a 64-char hex string (32 bytes)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encryptedData = cipher.update(text, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData,
    iv: iv.toString('hex'),
    authTag,
    version: ENCRYPTION_VERSION,
  };
};

/**
 * Decrypts data encrypted with AES-256-GCM.
 * @param {object} encryptedPayload - The payload containing encryptedData, iv, authTag, and version.
 * @returns {string} The decrypted string.
 */
exports.decrypt = (encryptedPayload) => {
  const { encryptedData, iv, authTag } = encryptedPayload;
  
  const key = Buffer.from(config.github.encryptionKey, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
