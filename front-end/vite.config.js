import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// Correct __dirname on Windows and Unix

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // Keep your original port
  },
})