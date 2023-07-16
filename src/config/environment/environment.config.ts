import { ConfigModule, registerAs } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';
import { Environments } from '@config/environment/Environments';
import databaseConfig from '@persistence/database.config';

const setEnvironment = (): Array<string> | string => {
  return {
    [Environments.development]: ['.env.dev', '.env'],
    [Environments.production]: '.env',
  }[process.env.NODE_ENV];
};

export const EnvironmentConfig = {
  setEnvironment,
  config: (): DynamicModule => {
    return ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
      load: [registerAs('database', databaseConfig)],
    });
  },
};
