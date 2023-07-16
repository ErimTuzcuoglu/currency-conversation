import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CustomException, ErrorMessages } from '@modules/common';

export const DatabaseSetup = async (
  configService: ConfigService,
): Promise<void> => {
  if (!configService)
    throw new CustomException(ErrorMessages.ConfigServiceNotFound);

  const options: TypeOrmModuleOptions = configService.get('database');
  let dataSource = await new DataSource({
    ...options,
    database: undefined,
  } as PostgresConnectionOptions).initialize();

  const checkDBScript = `SELECT 1 FROM pg_database WHERE datname = '${options.database}'`;
  const createDb = `CREATE DATABASE ${options.database}`;

  const result = await dataSource.query(checkDBScript);

  if (result.length === 0) await dataSource.query(createDb);

  if (dataSource.options.database === undefined) {
    await dataSource.destroy();
    dataSource = await new DataSource({
      ...options,
    } as PostgresConnectionOptions).initialize();
  }

  if (result.length === 0) await dataSource.runMigrations();

  await dataSource.destroy();
};
