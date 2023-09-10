export const baseConfig = (title: string): Record<string, any> => ({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title,
  },
  paths: {},
});

