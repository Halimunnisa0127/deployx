const crypto = require('crypto');
const tar = require('tar-stream');
const LocalArtifactStorageProvider = require('../providers/LocalArtifactStorageProvider');
const Artifact = require('../models/Artifact');
const Deployment = require('../../deployments/models/Deployment');
const config = require('../../../config/env/env');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.map': 'application/json'
};

const storageProvider = new LocalArtifactStorageProvider();

class ArtifactService {
  /**
   * Extracts the output directory from the container as a .tar stream, validates it against limits and symlinks,
   * calculates SHA-256 and size, stores it transactionally via StorageProvider, and persists the Artifact MongoDB model.
   */
  static async extractAndStoreArtifact(container, deployment, onLog) {
    const outputDir = deployment.buildSettings.outputDirectory || 'dist';
    const rootDir = deployment.buildSettings.rootDirectory && deployment.buildSettings.rootDirectory !== '/'
      ? deployment.buildSettings.rootDirectory.replace(/^\/|\/$/g, '')
      : '';
    const containerPath = rootDir ? `/workspace/${rootDir}/${outputDir}` : `/workspace/${outputDir}`;
    
    if (onLog) onLog('info', `Attempting to extract artifact from container path: ${containerPath}`);

    const MAX_SIZE = config.artifacts.maxSizeBytes;
    const MAX_FILES = config.artifacts.maxFileCount;

    let archiveStream;
    try {
      // Securely pull the archive directly from Docker daemon
      // getArchive enforces that path is within the container filesystem, preventing host path traversal.
      archiveStream = await container.getArchive({ path: containerPath });
    } catch (error) {
      if (error.statusCode === 404) {
        throw new Error(`Output directory '${outputDir}' does not exist inside the container after build.`);
      }
      throw new Error(`Failed to request artifact archive from container: ${error.message}`);
    }

    const storageKey = `artifacts/${deployment.project}/${deployment._id}.tar`;
    const extract = tar.extract();
    const pack = tar.pack(); // Re-pack valid files to store

    let totalSize = 0;
    let fileCount = 0;
    const hash = crypto.createHash('sha256');

    // A promise that resolves when extraction, validation, and re-packing are complete
    const processStreamPromise = new Promise((resolve, reject) => {
      extract.on('entry', (header, stream, next) => {
        fileCount++;
        
        if (fileCount > MAX_FILES) {
          return reject(new Error(`Artifact exceeds maximum allowed file count of ${MAX_FILES}.`));
        }

        // Untrusted Archive Validation
        if (header.name.includes('../') || header.name.includes('..\\') || header.name.startsWith('/')) {
          return reject(new Error(`Unsafe path traversal detected in archive entry: ${header.name}`));
        }

        // Prevent symlink escape (basic check: reject absolute symlinks or upward traversal symlinks)
        if (header.type === 'symlink' || header.type === 'link') {
          if (header.linkname && (header.linkname.startsWith('/') || header.linkname.includes('../'))) {
             return reject(new Error(`Unsafe symlink detected: ${header.name} -> ${header.linkname}`));
          }
        }

        totalSize += header.size || 0;
        if (totalSize > MAX_SIZE) {
          return reject(new Error(`Artifact exceeds maximum allowed size of ${MAX_SIZE} bytes.`));
        }

        // Write to pack and calculate hash incrementally
        const packStream = pack.entry(header, (err) => {
          if (err) return reject(err);
          next();
        });

        stream.on('data', (chunk) => {
           hash.update(chunk);
        });

        stream.pipe(packStream);
      });

      extract.on('finish', () => {
        pack.finalize();
        resolve();
      });

      extract.on('error', (err) => reject(err));
      archiveStream.on('error', (err) => reject(err));
    });

    // Pipe raw docker stream into extract parser
    archiveStream.pipe(extract);

    try {
      if (onLog) onLog('info', `Validating, hashing, and storing artifact to ${storageProvider.constructor.name}...`);
      
      // We run the Storage Provider putStream and the extraction validation concurrently.
      // If processStreamPromise rejects (e.g. limit hit), putStream will fail.
      await Promise.all([
        processStreamPromise,
        storageProvider.putStream(storageKey, pack)
      ]);
      
    } catch (processError) {
      // Transactional cleanup on failure
      if (onLog) onLog('error', `Artifact extraction failed: ${processError.message}. Cleaning up partial storage.`);
      await storageProvider.delete(storageKey);
      throw processError; // Rethrow to mark deployment failed
    }

    const checksum = hash.digest('hex');
    
    if (onLog) onLog('info', `Artifact processing successful. Size: ${totalSize} bytes, Files: ${fileCount}, SHA-256: ${checksum}`);

    let artifactDoc;
    try {
      // Transactional DB
      artifactDoc = await Artifact.create({
        deployment: deployment._id,
        project: deployment.project,
        storageProvider: 'local',
        storageKey,
        originalOutputDirectory: outputDir,
        size: totalSize,
        fileCount,
        checksum
      });

      // Update deployment reference
      await Deployment.findByIdAndUpdate(deployment._id, { artifact: artifactDoc._id });
    } catch (dbError) {
      // Cleanup storage if DB fails
      if (onLog) onLog('error', `Failed to persist artifact metadata to DB. Cleaning up stored artifact...`);
      await storageProvider.delete(storageKey);
      if (artifactDoc) await Artifact.findByIdAndDelete(artifactDoc._id).catch(() => {});
      throw new Error(`Failed to persist artifact metadata: ${dbError.message}`);
    }

    if (onLog) onLog('success', `Artifact securely collected and stored.`);
    return artifactDoc;
  }

  /**
   * Safely serves a single file directly from the `.tar` artifact stream.
   * Does not unpack to disk.
   */
  static serveFileFromArtifact(storageKey, reqPath, isSpaFallback, res) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Normalize requested path
        let normalizedPath = reqPath || '';
        
        // 2. Remove query strings and hash fragments
        normalizedPath = normalizedPath.split('?')[0].split('#')[0];

        // 3 & 4. Recursively URL-decode the requested path until no changes occur, catching malformed URI encoding safely
        try {
          let decodedPath = normalizedPath;
          let lastDecodedPath;
          do {
            lastDecodedPath = decodedPath;
            decodedPath = decodeURIComponent(decodedPath);
          } while (decodedPath !== lastDecodedPath);
          normalizedPath = decodedPath;
        } catch (error) {
          if (!res.headersSent) res.status(400).send('Invalid URI encoding');
          return resolve();
        }

        // 6. Normalize separators safely
        normalizedPath = normalizedPath.replace(/\\/g, '/');

        // 5. Reject invalid paths (traversals, absolute paths, null bytes)
        if (
          normalizedPath.includes('../') ||
          normalizedPath.includes('..\\') ||
          normalizedPath.includes('\0') ||
          normalizedPath.startsWith('/') ||
          path.isAbsolute(normalizedPath)
        ) {
          if (!res.headersSent) res.status(400).send('Invalid path traversal detected');
          return resolve();
        }

        // Default to index.html if empty
        if (!normalizedPath || normalizedPath === '/' || normalizedPath === '.') {
          normalizedPath = 'index.html';
        }

        let fileFound = false;
        
        // We get a readable stream of the .tar
        const archiveStream = await storageProvider.getArtifactStream(storageKey);
        const extract = tar.extract();

        extract.on('entry', (header, stream, next) => {
          const isMatch = header.name === normalizedPath || 
                         (header.name.includes('/') && header.name.substring(header.name.indexOf('/') + 1) === normalizedPath);
          // In tar, folders might be named 'dir/' but we are looking for files
          if (header.type === 'file' && isMatch) {
            fileFound = true;
            
            const ext = path.extname(header.name).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('X-Content-Type-Options', 'nosniff');
            // Cache static assets, but DO NOT cache index.html forever!
            if (normalizedPath === 'index.html') {
              res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
            } else {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            
            stream.pipe(res);
            
            stream.on('end', () => {
              // Abort the rest of the extraction for performance
              archiveStream.destroy();
            });
          } else {
            stream.on('end', () => next());
            stream.resume(); // drain
          }
        });

        extract.on('finish', () => {
          if (!fileFound) {
            const isStaticAsset = /\.[a-zA-Z0-9]+$/.test(normalizedPath) || normalizedPath.startsWith('assets/') || normalizedPath.startsWith('static/');
            if (isSpaFallback && !isStaticAsset && normalizedPath !== 'index.html') {
              // Re-trigger for SPA fallback to index.html
              ArtifactService.serveFileFromArtifact(storageKey, 'index.html', false, res)
                .then(resolve)
                .catch(reject);
            } else {
              if (!res.headersSent) res.status(404).send('Not Found');
              resolve();
            }
          } else {
            resolve();
          }
        });

        extract.on('error', (err) => {
          if (!res.headersSent) {
            console.error('[ArtifactService] Error extracting tar stream:', err.message);
            res.status(500).send('Internal Server Error');
          }
          resolve();
        });

        archiveStream.on('error', (err) => {
          // It's normal for stream to error with "premature close" if we abort it early.
          if (!fileFound && !res.headersSent) {
            res.status(500).send('Storage read error');
          }
          resolve();
        });

        archiveStream.pipe(extract);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = ArtifactService;
