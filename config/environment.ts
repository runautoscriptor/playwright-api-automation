export function parseApiTimeout(value: string | undefined): number {
  const timeout = Number(value ?? 30000);

  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error('API_TIMEOUT must be a positive number of milliseconds.');
  }

  return timeout;
}

export const environment = {
  baseUrl: process.env.BASE_URL ?? 'https://dummyjson.com',
  timeout: parseApiTimeout(process.env.API_TIMEOUT),
};
