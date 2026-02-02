import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility functions for file system operations
 */

/**
 * Ensures a directory exists, creating it if necessary
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Copies a file from source to destination
 */
export function copyFile(src: string, dest: string): void {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    throw new Error(`Failed to copy file from ${src} to ${dest}: ${(error as Error).message}`);
  }
}

/**
 * Checks if a file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Gets the project root directory
 */
export function getProjectRoot(): string {
  // Navigate up from scripts/utils/ to project root
  return path.resolve(__dirname, '..', '..');
}

/**
 * Joins path segments relative to project root
 */
export function joinProjectPath(...segments: string[]): string {
  return path.join(getProjectRoot(), ...segments);
}