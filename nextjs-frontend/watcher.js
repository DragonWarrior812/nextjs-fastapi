const chokidar = require('chokidar');
const { exec } = require('child_process');

// Watch the specific file for changes
chokidar.watch('/app/shared-data/openapi.json').on('change', (path) => {
  console.log(`File ${path} has been modified. Running generate-client...`);
  exec('npm run generate-client', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});