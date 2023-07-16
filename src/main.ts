import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Environments } from '@config/environment/Environments';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';
import { GlobalExceptionFilter } from '@modules/common/middleware/filters/GlobalExceptionFilter';
import { TransformInterceptor } from '@modules/common/middleware/interceptors/TransformInterceptor';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /* #region  Global Exception Middleware */
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());
  /* #endregion */
  app.use(helmet());

  if (
    configService.get(EnvironmentVariables.NODE_ENV) ===
    Environments.development
  ) {
    const config = new DocumentBuilder()
      .setTitle(configService.get(EnvironmentVariables.SW_TITLE))
      .setDescription(configService.get(EnvironmentVariables.SW_DESCRIPTION))
      .setVersion(configService.get(EnvironmentVariables.SW_VERSION))
      .addSecurity('jwt', {
        description: `Please enter JWT token in following format: -JWT-`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
    // SwaggerModule.setup('/', app, document);
  }

  await app.listen(configService.get(EnvironmentVariables.APP_PORT));
}
bootstrap();
