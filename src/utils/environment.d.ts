declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_DB: string;
      POSTGRES_DB_TEST: string;
      POSTGRES_PORT: number;
      POSTGRES_USER: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;

      NODE_ENV: 'prod' | 'dev';
      SERVER_PORT: number;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_SECRET: string;

      RELAY_HOST: string;
      RELAY_PORT: number;
      RELAY_SECURE: boolean;
      RELAY_USER: string;
      RELAY_PASSWORD: string;
    }
  }
}

export {};
