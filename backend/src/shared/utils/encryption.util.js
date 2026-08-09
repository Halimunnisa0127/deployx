const crypto = require('crypto');
const config = require('../../config/env/env');

const ALGORITHM = 'aes-256-gcm';

/**
 * Utility to securely encrypt and decrypt project environment variables.
 */
class EncryptionUtil {
  /**
   * Ensure the key is valid for AES-256
   */
  static _getKey() {
    const keyString = config.secrets.encryptionKey;
    if (!keyString) {
      throw new Error('FATAL: PROJECT_SECRET_ENCRYPTION_KEY is missing.');
    }
    
    // The key is expected to be exactly 64 hex characters (32 bytes)
    if (!/^[0-9a-fA-F]{64}$/.test(keyString)) {
      throw new Error('FATAL: PROJECT_SECRET_ENCRYPTION_KEY must be exactly 64 hexadecimal characters.');
    }

    return Buffer.from(keyString, 'hex');
  }

  /**
   * Encrypts plaintext into authenticated ciphertext.
   * @param {string} plaintext 
   * @returns {{ ciphertext: string, iv: string, authTag: string }}
   */
  static encrypt(plaintext) {
    if (typeof plaintext !== 'string') {
      throw new Error('Encryption target must be a string.');
    }

    const key = this._getKey();
    const iv = crypto.randomBytes(16); // Fresh random IV for every encryption

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag,
    };
  }

  /**
   * Decrypts authenticated ciphertext back into plaintext.
   * @param {string} ciphertext 
   * @param {string} ivHex 
   * @param {string} authTagHex 
   * @returns {string} plaintext
   */
  static decrypt(ciphertext, ivHex, authTagHex) {
    if (!ciphertext || !ivHex || !authTagHex) {
      throw new Error('Missing required encryption metadata for decryption.');
    }

    const key = this._getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8'); // Will throw if authentication fails

    return decrypted;
  }
}

module.exports = EncryptionUtil;
