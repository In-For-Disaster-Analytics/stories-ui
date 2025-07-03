import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  console.log(`Loading environment variables for mode: ${mode}`);
  const env = loadEnv(mode, process.cwd());

  // Validate required environment variables
  if (!env.VITE_TAPIS_API_BASE_URL) {
    throw new Error(
      'VITE_TAPIS_API_BASE_URL is required in environment variables',
    );
  }
  if (!env.VITE_CKAN_BASE_URL) {
    throw new Error('VITE_CKAN_BASE_URL is required in environment variables');
  }
  if (!env.VITE_MAX_FILE_SIZE) {
    throw new Error('VITE_MAX_FILE_SIZE is required in environment variables');
  }

  return {
    resolve: {
      alias: {
        src: '/src',
      },
    },
    plugins: [react()],
  };
});
