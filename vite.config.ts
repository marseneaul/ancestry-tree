import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ancestry-tree/',  // Set to '/ancestry-tree/' for GitHub Pages subdirectory
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