import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Inline all assets into a single HTML file for easy sharing
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
