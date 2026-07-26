export const environment = {
  baseUrl: process.env.BASE_URL ?? 'https://dummyjson.com',
  timeout: Number(process.env.API_TIMEOUT ?? 30000),
};
