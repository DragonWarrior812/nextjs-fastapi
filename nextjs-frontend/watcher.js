const chokidar = require('chokidar');
const { exec } = require('child_process');

const watchFile = process.env.OPENAPI_WATCH_FILE || './openapi.json';
// Watch the specific file for changes
chokidar.watch(watchFile).on('change', (path) => {
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