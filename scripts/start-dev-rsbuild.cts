import { type ChildProcess, spawn } from 'node:child_process';
import getPort from 'get-port';
import waitOn from 'wait-on';

/**
 * Starts the development server with rsbuild and electron
 */
async function startDevServer(): Promise<void> {
  try {
    // Get a random available port
    const port = await getPort();
    console.log(`Using port: ${port}`);

    // Set the PORT environment variable for rsbuild
    process.env.PORT = port.toString();

    // Spawn rsbuild dev server with the random port
    const rsbuildProcess: ChildProcess = spawn(
      './node_modules/.bin/rsbuild',
      ['dev', '--port', port.toString()],
      {
        stdio: 'inherit',
        env: { ...process.env },
      }
    );

    // Wait for the Rsbuild server to be ready
    const resources = [`http://localhost:${port}`];

    setTimeout(async () => {
      try {
        await waitOn({ resources, timeout: 30000 }); // Wait up to 30 seconds

        // Pass the port to electron via environment variable
        process.env.ELECTRON_START_URL = `http://localhost:${port}`;

        const electronProcess: ChildProcess = spawn(
          './node_modules/.bin/electron',
          ['--require', 'tsx', 'src/electron-main/main.ts', '--start-dev'],
          {
            stdio: 'inherit',
            env: { ...process.env, ELECTRON_START_URL: `http://localhost:${port}` },
          }
        );

        electronProcess.on('close', (code: number | null) => {
          console.log(`Electron process exited with code ${code}`);
          if (rsbuildProcess.pid) {
            rsbuildProcess.kill();
          }
        });
      } catch (waitError: any) {
        console.error('Timeout waiting for Rsbuild server to start:', waitError);
        if (rsbuildProcess.pid) {
          rsbuildProcess.kill();
        }
      }
    }, 2000); // Initial delay before checking

    rsbuildProcess.on('close', (code: number | null) => {
      console.log(`Rsbuild process exited with code ${code}`);
    });
  } catch (error: any) {
    console.error('Error starting dev server:', error);
  }
}

startDevServer();
