import getPort from 'get-port';
import waitOn from 'wait-on';

/**
 * Utility functions for network operations
 */

/**
 * Gets an available port
 */
export async function getAvailablePort(): Promise<number> {
  try {
    return await getPort();
  } catch (error) {
    throw new Error(`Failed to get available port: ${(error as Error).message}`);
  }
}

/**
 * Waits for resources to become available
 */
export async function waitForResources(resources: string[], timeout: number = 30000): Promise<void> {
  try {
    await waitOn({ resources, timeout });
  } catch (error) {
    throw new Error(`Timeout waiting for resources: ${(error as Error).message}`);
  }
}