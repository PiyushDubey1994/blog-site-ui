import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
build: {
    rollupOptions: {
      input: '/src/main.jsx',
    },
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/material', '@emotion/react', '@emotion/styled']
  }
});

