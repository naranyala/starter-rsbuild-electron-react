/**
 * File management use-cases for backend
 */

import { FileSystemUtils, SecurityUtils, SystemUtils } from '../../lib/main-utils';

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  extension: string;
  isDirectory: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface DirectoryListing {
  path: string;
  files: FileInfo[];
  directories: FileInfo[];
}

/**
 * Read file content safely
 */
export const readFileUseCase = {
  id: 'file.read',

  async execute(
    filePath: string,
    options?: {
      encoding?: BufferEncoding;
      allowedPaths?: string[];
    }
  ): Promise<string | Buffer> {
    // Security validation
    const validation = SecurityUtils.validatePath(filePath);
    if (!validation.isValid) {
      throw new Error(`Path validation failed: ${validation.issues.join(', ')}`);
    }

    // Check if file is in allowed paths
    if (options?.allowedPaths) {
      const isAllowed = options.allowedPaths.some((allowedPath) =>
        filePath.startsWith(allowedPath)
      );

      if (!isAllowed) {
        throw new Error(`File access denied: ${filePath}`);
      }
    }

    return FileSystemUtils.readFile(filePath, options?.encoding);
  },
};

/**
 * Write file content safely
 */
export const writeFileUseCase = {
  id: 'file.write',

  async execute(
    filePath: string,
    content: string | Buffer,
    options?: {
      encoding?: BufferEncoding;
      allowedPaths?: string[];
      overwrite?: boolean;
    }
  ): Promise<void> {
    // Security validation
    const validation = SecurityUtils.validatePath(filePath);
    if (!validation.isValid) {
      throw new Error(`Path validation failed: ${validation.issues.join(', ')}`);
    }

    // Check if file is in allowed paths
    if (options?.allowedPaths) {
      const isAllowed = options.allowedPaths.some((allowedPath) =>
        filePath.startsWith(allowedPath)
      );

      if (!isAllowed) {
        throw new Error(`File access denied: ${filePath}`);
      }
    }

    // Check if file exists and overwrite is disabled
    if (!options?.overwrite && (await FileSystemUtils.fileExists(filePath))) {
      throw new Error(`File already exists: ${filePath}`);
    }

    return FileSystemUtils.writeFile(filePath, content);
  },
};

/**
 * List directory contents
 */
export const listDirectoryUseCase = {
  id: 'file.list-directory',

  async execute(
    dirPath: string,
    options?: {
      recursive?: boolean;
      includeDirectories?: boolean;
      filter?: RegExp;
      allowedPaths?: string[];
    }
  ): Promise<DirectoryListing> {
    // Security validation
    const validation = SecurityUtils.validatePath(dirPath);
    if (!validation.isValid) {
      throw new Error(`Path validation failed: ${validation.issues.join(', ')}`);
    }

    // Check if directory is in allowed paths
    if (options?.allowedPaths) {
      const isAllowed = options.allowedPaths.some((allowedPath) => dirPath.startsWith(allowedPath));

      if (!isAllowed) {
        throw new Error(`Directory access denied: ${dirPath}`);
      }
    }

    const files: FileInfo[] = [];
    const directories: FileInfo[] = [];

    const entries = await FileSystemUtils.listDirectory(dirPath, {
      recursive: options?.recursive || false,
      includeDirectories: true,
      filter: options?.filter,
    });

    for (const entryPath of entries) {
      const stats = await FileSystemUtils.getFileStats(entryPath);
      const isDirectory = stats.isDirectory();

      const fileInfo: FileInfo = {
        path: entryPath,
        name: FileSystemUtils.getFileName(entryPath),
        size: stats.size,
        extension: FileSystemUtils.getFileExtension(entryPath),
        isDirectory,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };

      if (isDirectory) {
        directories.push(fileInfo);
      } else {
        files.push(fileInfo);
      }
    }

    return {
      path: dirPath,
      files,
      directories,
    };
  },
};

/**
 * Delete file or directory
 */
export const deleteFileUseCase = {
  id: 'file.delete',

  async execute(
    filePath: string,
    options?: {
      recursive?: boolean;
      allowedPaths?: string[];
    }
  ): Promise<void> {
    // Security validation
    const validation = SecurityUtils.validatePath(filePath);
    if (!validation.isValid) {
      throw new Error(`Path validation failed: ${validation.issues.join(', ')}`);
    }

    // Check if file is in allowed paths
    if (options?.allowedPaths) {
      const isAllowed = options.allowedPaths.some((allowedPath) =>
        filePath.startsWith(allowedPath)
      );

      if (!isAllowed) {
        throw new Error(`File access denied: ${filePath}`);
      }
    }

    if (await FileSystemUtils.dirExists(filePath)) {
      if (options?.recursive) {
        await FileSystemUtils.removeDirectory(filePath);
      } else {
        throw new Error(`Cannot delete directory without recursive flag: ${filePath}`);
      }
    } else {
      await FileSystemUtils.removeFile(filePath);
    }
  },
};

/**
 * Copy file or directory
 */
export const copyFileUseCase = {
  id: 'file.copy',

  async execute(
    sourcePath: string,
    destPath: string,
    options?: {
      overwrite?: boolean;
      allowedPaths?: string[];
    }
  ): Promise<void> {
    // Security validation for both paths
    for (const path of [sourcePath, destPath]) {
      const validation = SecurityUtils.validatePath(path);
      if (!validation.isValid) {
        throw new Error(`Path validation failed for ${path}: ${validation.issues.join(', ')}`);
      }

      // Check if paths are in allowed paths
      if (options?.allowedPaths) {
        const isAllowed = options.allowedPaths.some((allowedPath) => path.startsWith(allowedPath));

        if (!isAllowed) {
          throw new Error(`File access denied: ${path}`);
        }
      }
    }

    // Check if destination exists and overwrite is disabled
    if (!options?.overwrite && (await FileSystemUtils.fileExists(destPath))) {
      throw new Error(`Destination already exists: ${destPath}`);
    }

    await FileSystemUtils.copyFile(sourcePath, destPath);
  },
};
