export const environment = {
  production: true,
  apiUrl: (globalThis as any)?.process?.env?.['API_URL'] || 'https://raas-api.render.com/api'
};
