import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Set to '/' for custom domain (root path); assets load correctly at maxarseneault.com
  build: {
    outDir: 'dist',  // Output folder for built files
  },
  resolve: {
    alias: {
      // If your imports use relative paths like "./data/configs/...", this ensures they resolve
      // Add any custom aliases if needed (e.g., for utils or data folders)
    },
  },
});