import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      external: [
        '@aws-crypto/sha256-js',
        '@aws-crypto/util',
        '@aws-sdk/middleware-retry',
        '@aws-sdk/util-retry',
        '@aws-sdk/smithy-client'
      ]
    }
  },
  optimizeDeps: {
    include: ['@aws-amplify/auth'],
    exclude: [
      '@aws-crypto/sha256-js',
      '@aws-crypto/util',
      '@aws-sdk/middleware-retry',
      '@aws-sdk/util-retry',
      '@aws-sdk/smithy-client'
    ]
  }
});
