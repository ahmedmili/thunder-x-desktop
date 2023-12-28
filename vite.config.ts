// import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // plugins: [
  //   million.vite(),
  //   // Add additional plugins or configuration options here
  // ],
  plugins: [react()],
  base: '/',

  build: {
    chunkSizeWarningLimit: 1600, // Adjust chunk size warning limit
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      output: {
        // entryFileNames: 'assets/index.js',
        // chunkFileNames: 'assets/[name]-[hash].js',
        // assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],

});




