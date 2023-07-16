import { DataSourceOptions } from 'typeorm';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';
/* #region Entites */
import { Currency } from '@modules/currency/entities/currency.entity';
import { Rate } from '@modules/currency/entities/rate.entity';
import { Offer } from '@modules/offer/entities/offer.entity';
import { User } from '@modules/user/entities/user.entity';
import { Wallet } from '@modules/user/entities/wallet.entity';
/* #endregion */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

export default () => {
  const {
    [EnvironmentVariables.DB_HOST]: DB_HOST,
    [EnvironmentVariables.DB_PORT]: DB_PORT,
    [EnvironmentVariables.DB_USERNAME]: DB_USERNAME,
    [EnvironmentVariables.DB_PASSWORD]: DB_PASSWORD,
    [EnvironmentVariables.DB_NAME]: DB_NAME,
  } = process.env;
  const migrationsDir = path.join(__dirname, 'migrations');

  return {
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT) || 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    entities: [User, Currency, Rate, Wallet, Offer],
    // logging: 'all',
    synchronize: false,
    migrationsRun: false,
    migrations: [`${migrationsDir}/*{.ts,.js}`],
    cli: {
      migrationsDir: migrationsDir,
    },
    database: DB_NAME,
  } as DataSourceOptions;
};
