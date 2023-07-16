import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiResponse, AuthorizeException } from '@modules/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) httpStatus = exception.getStatus();
    if (exception instanceof AuthorizeException)
      httpStatus = HttpStatus.UNAUTHORIZED;

    const responseBody: ApiResponse<Record<string, unknown>> = {
      data: null,
      errors: [exception.message],
      message: 'Error',
      succeeded: false,
    };

    if (exception.constructor.name !== 'Error') {
      return httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

    responseBody.timestamp = new Date().toISOString();
    responseBody.stackTrace = exception.stack;

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
