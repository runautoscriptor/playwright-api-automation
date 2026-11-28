const DEFAULT_BASE_URL = 'https://dummyjson.com';

export function parseBaseUrl(value: string | undefined): string {
  const baseUrl = value ?? DEFAULT_BASE_URL;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new Error('BASE_URL must be a valid absolute HTTP or HTTPS URL.');
  }

  if (
    (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') ||
    !parsedUrl.hostname
  ) {
    throw new Error('BASE_URL must be a valid absolute HTTP or HTTPS URL.');
  }

  return baseUrl;
}

export function parseApiTimeout(value: string | undefined): number {
  const timeout = Number(value ?? 30000);

  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new Error('API_TIMEOUT must be a positive number of milliseconds.');
  }

  return timeout;
}

export const environment = {
  baseUrl: parseBaseUrl(process.env.BASE_URL),
  timeout: parseApiTimeout(process.env.API_TIMEOUT),
};
