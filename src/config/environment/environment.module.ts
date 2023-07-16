import { Module } from '@nestjs/common';
import { EnvironmentConfig } from '@config/environment/environment.config';

@Module({
  imports: [EnvironmentConfig.config()],
})
export class EnvironmentModule {}
