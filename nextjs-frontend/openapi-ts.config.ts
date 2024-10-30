import { defineConfig } from '@hey-api/openapi-ts';
import { config } from 'dotenv';

config({ path: '.env.local' });

const watchFile = process.env.OPENAPI_WATCH_FILE || process.env.LOCAL_OPENAPI_WATCH_FILE;

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: watchFile as string,
  output: 'app/openapi-client',
});