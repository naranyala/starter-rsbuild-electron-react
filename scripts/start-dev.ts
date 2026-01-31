import { type ChildProcess, spawn } from 'node:child_process';
import getPort from 'get-port';
import waitOn from 'wait-on';

async function startDevServer(): Promise<void> {
  try {
    // Get a random available port
    const port = await getPort();
    console.log(`Using port: ${port}`);

    // Set the PORT environment variable for parcel
    process.env.PORT = port.toString();

    // Spawn parcel dev server with the random port
    const parcelProcess: ChildProcess = spawn(
      './node_modules/.bin/parcel',
      ['./src/index.html', '--dist-dir', 'build', '--port', port.toString()],
      {
        stdio: 'inherit',
        env: { ...process.env },
      }
    );

    // Wait for the Parcel server to be ready
    const resources = [`http://localhost:${port}`];

    setTimeout(async () => {
      try {
        await waitOn({ resources, timeout: 30000 }); // Wait up to 30 seconds

        // Pass the port to electron via environment variable
        process.env.ELECTRON_START_URL = `http://localhost:${port}`;

        const electronProcess: ChildProcess = spawn(
          './node_modules/.bin/electron',
          ['main.js', '--start-dev'],
          {
            stdio: 'inherit',
            env: { ...process.env, ELECTRON_START_URL: `http://localhost:${port}` },
          }
        );

        electronProcess.on('close', (code: number | null) => {
          console.log(`Electron process exited with code ${code}`);
          if (parcelProcess.pid) {
            parcelProcess.kill();
          }
        });
      } catch (waitError: any) {
        console.error('Timeout waiting for Parcel server to start:', waitError);
        if (parcelProcess.pid) {
          parcelProcess.kill();
        }
      }
    }, 2000); // Initial delay before checking

    parcelProcess.on('close', (code: number | null) => {
      console.log(`Parcel process exited with code ${code}`);
    });
  } catch (error: any) {
    console.error('Error starting dev server:', error);
  }
}

startDevServer();
