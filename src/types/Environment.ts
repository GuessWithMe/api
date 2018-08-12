export interface EnvironmentType {
  env: 'development'|'production'|'test';

  spotifyClientId: string;
  spotifyClientSecret: string;

  angularUrl: string;

  maria: {
    host: string;
    port: number;
    user: string;
    pass: string;
    db: string;
  };
}
