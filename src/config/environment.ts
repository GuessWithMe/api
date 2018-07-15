import { EnvironmentType } from '@t/Environment';

import DevelopmentEnv from './env/development';
import ProductionEnv from './env/production';
import TestEnv from './env/test';

function getConfig(): EnvironmentType {
  switch (process.env.NODE_ENV) {
    case 'production':
      return ProductionEnv;
    case 'test':
      return TestEnv;
    default:
      return DevelopmentEnv;
  }
}

export default getConfig();
