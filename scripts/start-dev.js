const { spawn } = require('child_process');
const getPortModule = require('get-port');
const waitOn = require('wait-on');

// Handle both CommonJS and ES module formats for get-port
const getPort = typeof getPortModule === 'function' ? getPortModule : getPortModule.default;

async function startDevServer() {
  try {
    // Get a random available port
    const port = await getPort();
    console.log(`Using port: ${port}`);

    // Set the PORT environment variable for parcel
    process.env.PORT = port.toString();

    // Spawn parcel dev server with the random port
    const parcelProcess = spawn(
      './node_modules/.bin/parcel',
      ['./src/index.html', '--dist-dir', 'build', '--port', port],
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

        const electronProcess = spawn('./node_modules/.bin/electron', ['main.js', '--start-dev'], {
          stdio: 'inherit',
          env: { ...process.env, ELECTRON_START_URL: `http://localhost:${port}` },
        });

        electronProcess.on('close', (code) => {
          console.log(`Electron process exited with code ${code}`);
          parcelProcess.kill();
        });
      } catch (waitError) {
        console.error('Timeout waiting for Parcel server to start:', waitError);
        parcelProcess.kill();
      }
    }, 2000); // Initial delay before checking

    parcelProcess.on('close', (code) => {
      console.log(`Parcel process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Error starting dev server:', error);
  }
}

startDevServer();
