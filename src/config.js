/**
 * App config from environment variables (.env)
 * Vite requires the VITE_ prefix for client-side vars.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'A.U.S';

export const config = {
  apiUrl: API_URL.replace(/\/$/, ''),
  backendUrl: BACKEND_URL.replace(/\/$/, ''),
  appName: APP_NAME,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default config;
