import { defineConfig } from '@hey-api/openapi-ts';
import { config } from 'dotenv';

config({ path: '.env.local' });

const openapiFile = process.env.OPENAPI_OUTPUT_FILE

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: openapiFile as string,
  output: 'app/openapi-client',
});