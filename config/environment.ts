const configuredTimeout = Number(process.env.API_TIMEOUT ?? 30000);

if (!Number.isFinite(configuredTimeout) || configuredTimeout <= 0) {
  throw new Error('API_TIMEOUT must be a positive number of milliseconds.');
}

export const environment = {
  baseUrl: process.env.BASE_URL ?? 'https://dummyjson.com',
  timeout: configuredTimeout,
};
