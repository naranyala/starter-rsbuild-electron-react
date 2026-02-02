import { type ChildProcess, spawn } from 'node:child_process';

/**
 * Utility functions for process management
 */

/**
 * Spawns a child process with proper error handling
 */
export function spawnProcess(
  command: string,
  args: string[],
  options: { stdio?: any; env?: any } = {}
): ChildProcess {
  const process = spawn(command, args, {
    stdio: options.stdio || 'pipe',
    env: options.env || process.env,
  });

  // Handle process errors
  process.on('error', (err) => {
    console.error(`Failed to spawn process: ${command}`, err);
  });

  return process;
}

/**
 * Kills a process gracefully
 */
export function killProcess(process: ChildProcess, signal: NodeJS.Signals = 'SIGTERM'): void {
  if (process.pid && !process.killed) {
    try {
      process.kill(signal);
    } catch (error) {
      console.warn(`Warning: Could not kill process ${process.pid}: ${(error as Error).message}`);
    }
  }
}

/**
 * Waits for a process to exit
 */
export async function waitForProcess(process: ChildProcess): Promise<number | null> {
  return new Promise((resolve) => {
    process.on('close', (code) => {
      resolve(code);
    });
  });
}