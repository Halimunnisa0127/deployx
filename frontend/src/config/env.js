export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  APP_BASE_DOMAIN: import.meta.env.VITE_APP_BASE_DOMAIN || 'deployx.app',
};

export default env;

