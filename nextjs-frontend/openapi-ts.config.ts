import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-fetch',
  input: 'shared-data/openapi.json',
  output: 'app/openapi-client',
});