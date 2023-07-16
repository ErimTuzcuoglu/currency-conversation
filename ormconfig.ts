import databaseConfig from '@persistence/database.config';
import { DataSource } from 'typeorm';

export default new DataSource(databaseConfig());
