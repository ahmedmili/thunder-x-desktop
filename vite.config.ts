import million from 'million/compiler';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    million.vite(),
    // Add additional plugins or configuration options here
  ],
  base: './',
  build: {
    chunkSizeWarningLimit: 1000, // Adjust chunk size warning limit
    // outDir: 'build',
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],

});