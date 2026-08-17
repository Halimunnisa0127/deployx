const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

class LocalArtifactStorageProvider {
  constructor() {
    this.baseDir = path.join(process.cwd(), '.artifacts');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Safely checks and returns the absolute path for a key, preventing traversal.
   */
  _getSafePath(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new Error('Invalid storage key');
    }
    
    // Prevent obvious path traversals
    if (key.includes('\0') || key.includes('../') || key.includes('..\\') || path.isAbsolute(key)) {
      throw new Error('Unsafe storage key: path traversal detected');
    }

    const safePath = path.join(this.baseDir, key);
    
    // Final verification that it resolves inside baseDir
    if (!safePath.startsWith(this.baseDir)) {
      throw new Error('Unsafe storage key: escape from artifact directory detected');
    }

    return safePath;
  }

  /**
   * Pipes an incoming stream to a local file securely.
   */
  async putStream(key, stream) {
    const targetPath = this._getSafePath(key);
    
    // Ensure parent directory exists (e.g. if key contains slashes like 'project/deployment.tar')
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(targetPath);
    
    try {
      await pipeline(stream, writeStream);
    } catch (err) {
      // Clean up partial file on failure
      this.delete(key).catch(() => {}); // ignore cleanup error
      throw err;
    }
  }

  /**
   * Safely deletes an artifact.
   */
  async delete(key) {
    try {
      const targetPath = this._getSafePath(key);
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath);
      }
    } catch (error) {
      console.warn(`[LocalArtifactStorageProvider] Failed to delete artifact ${key}:`, error.message);
      // Fail silently to prevent throwing on cleanup
    }
  }

  /**
   * Checks if an artifact exists.
   */
  async exists(key) {
    try {
      const targetPath = this._getSafePath(key);
      return fs.existsSync(targetPath);
    } catch {
      return false;
    }
  }

  /**
   * Returns a readable stream for an artifact.
   */
  async getArtifactStream(key) {
    const targetPath = this._getSafePath(key);
    if (!fs.existsSync(targetPath)) {
      throw new Error(`Artifact ${key} not found`);
    }
    return fs.createReadStream(targetPath);
  }
}

module.exports = LocalArtifactStorageProvider;
