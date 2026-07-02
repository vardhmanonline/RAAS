const configuredApiUrl =
  (globalThis as { __RAAS_API_URL__?: string }).__RAAS_API_URL__ ||
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.['API_URL'];

export const environment = {
  production: true,
  apiUrl: configuredApiUrl || 'https://raas-api.onrender.com/api'
};
