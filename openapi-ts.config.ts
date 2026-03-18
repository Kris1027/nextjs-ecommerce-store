import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './src/api/openapi.json',
  output: 'src/api/generated',
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/sdk',
    '@hey-api/typescript',
    {
      name: '@tanstack/react-query',
      queryOptions: true,
      mutationOptions: true,
    },
    'zod',
  ],
});
