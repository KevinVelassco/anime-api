import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let error: string | Object;

    if (exceptionResponse) {
      error =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as object);
    } else {
      error = {
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message || null
            : exception.message || 'Internal server error'
      };
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url} ${status}`,
        exception.stack,
        CustomExceptionFilter.name
      );
    } else {
      Logger.error(
        `${request.method} ${request.url} ${status}`,
        JSON.stringify({
          statusCode: status,
          path: request.url,
          method: request.method,
          ...error
        }),
        CustomExceptionFilter.name
      );
    }

    response.status(status).json({
      statusCode: status,
      ...error
    });
  }
}
