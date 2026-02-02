import { spawnProcess, killProcess, waitForProcess } from './utils/process-utils';
import { getAvailablePort, waitForResources } from './utils/network-utils';
import { ErrorHandler } from './utils/error-handler';
import { Logger, LogLevel } from './utils/logger';

/**
 * Starts the development server with rsbuild and electron
 */

interface DevServerContext {
  rsbuildProcess?: import('child_process').ChildProcess;
  electronProcess?: import('child_process').ChildProcess;
  port?: number;
}

class DevServerManager {
  private context: DevServerContext = {};

  async startDevServer(): Promise<void> {
    try {
      Logger.info('Starting development server...');
      
      // Get a random available port
      this.context.port = await getAvailablePort();
      Logger.info(`Using port: ${this.context.port}`);

      // Set the PORT environment variable for rsbuild
      process.env.PORT = this.context.port.toString();

      // Spawn rsbuild dev server with the random port
      this.context.rsbuildProcess = spawnProcess(
        './node_modules/.bin/rsbuild',
        ['dev', '--port', this.context.port.toString()],
        { stdio: 'inherit', env: { ...process.env } }
      );

      // Wait for the Rsbuild server to be ready
      const resources = [`http://localhost:${this.context.port}`];

      setTimeout(async () => {
        try {
          await waitForResources(resources, 30000); // Wait up to 30 seconds

          // Pass the port to electron via environment variable
          process.env.ELECTRON_START_URL = `http://localhost:${this.context.port!.toString()}`;

          this.context.electronProcess = spawnProcess(
            './node_modules/.bin/electron',
            ['--require', 'tsx', 'src/electron-main/main.ts', '--start-dev'],
            {
              stdio: 'inherit',
              env: { ...process.env, ELECTRON_START_URL: `http://localhost:${this.context.port!.toString()}` },
            }
          );

          this.context.electronProcess.on('close', (code: number | null) => {
            Logger.info(`Electron process exited with code ${code}`);
            this.cleanupAndExit();
          });
        } catch (waitError: any) {
          Logger.error('Timeout waiting for Rsbuild server to start:', waitError);
          this.cleanupAndExit();
        }
      }, 2000); // Initial delay before checking

      this.context.rsbuildProcess.on('close', (code: number | null) => {
        Logger.info(`Rsbuild process exited with code ${code}`);
        this.cleanupAndExit();
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'start-dev-server');
      this.cleanupAndExit();
    }
  }

  private cleanupAndExit(): void {
    try {
      if (this.context.electronProcess) {
        killProcess(this.context.electronProcess);
      }
      if (this.context.rsbuildProcess) {
        killProcess(this.context.rsbuildProcess);
      }
    } catch (cleanupError) {
      Logger.error('Error during cleanup:', cleanupError);
    } finally {
      process.exit(1);
    }
  }
}

async function startDevServer(): Promise<void> {
  const manager = new DevServerManager();
  await manager.startDevServer();
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startDevServer();
}

export { startDevServer, DevServerManager };