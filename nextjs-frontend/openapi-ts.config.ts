import { defineConfig } from '@hey-api/openapi-ts';

const watchFile = process.env.OPENAPI_WATCH_FILE || './openapi.json';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: watchFile as string,
  output: 'app/openapi-client',
});