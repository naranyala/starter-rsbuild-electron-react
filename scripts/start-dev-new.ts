import { spawnProcess, killProcess } from './utils/process-utils';
import { getAvailablePort, waitForResources } from './utils/network-utils';
import { ErrorHandler } from './utils/error-handler';
import { Logger } from './utils/logger';

/**
 * Starts the development server with parcel and electron
 */

interface DevServerContext {
  parcelProcess?: import('child_process').ChildProcess;
  electronProcess?: import('child_process').ChildProcess;
  port?: number;
}

class ParcelDevServerManager {
  private context: DevServerContext = {};

  async startDevServer(): Promise<void> {
    try {
      Logger.info('Starting Parcel development server...');
      
      // Get a random available port
      this.context.port = await getAvailablePort();
      Logger.info(`Using port: ${this.context.port}`);

      // Set the PORT environment variable for parcel
      process.env.PORT = this.context.port.toString();

      // Spawn parcel dev server with the random port
      this.context.parcelProcess = spawnProcess(
        './node_modules/.bin/parcel',
        ['./src/index.html', '--dist-dir', 'build', '--port', this.context.port.toString()],
        { stdio: 'inherit', env: { ...process.env } }
      );

      // Wait for the Parcel server to be ready
      const resources = [`http://localhost:${this.context.port}`];

      setTimeout(async () => {
        try {
          await waitForResources(resources, 30000); // Wait up to 30 seconds

          // Pass the port to electron via environment variable
          process.env.ELECTRON_START_URL = `http://localhost:${this.context.port!.toString()}`;

          this.context.electronProcess = spawnProcess(
            './node_modules/.bin/electron',
            ['main.js', '--start-dev'],
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
          Logger.error('Timeout waiting for Parcel server to start:', waitError);
          this.cleanupAndExit();
        }
      }, 2000); // Initial delay before checking

      this.context.parcelProcess.on('close', (code: number | null) => {
        Logger.info(`Parcel process exited with code ${code}`);
        this.cleanupAndExit();
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'start-parcel-dev-server');
      this.cleanupAndExit();
    }
  }

  private cleanupAndExit(): void {
    try {
      if (this.context.electronProcess) {
        killProcess(this.context.electronProcess);
      }
      if (this.context.parcelProcess) {
        killProcess(this.context.parcelProcess);
      }
    } catch (cleanupError) {
      Logger.error('Error during cleanup:', cleanupError);
    } finally {
      process.exit(1);
    }
  }
}

async function startParcelDevServer(): Promise<void> {
  const manager = new ParcelDevServerManager();
  await manager.startDevServer();
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startParcelDevServer();
}

export { startParcelDevServer, ParcelDevServerManager };