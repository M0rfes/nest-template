import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const i18n = I18nContext.current(host);
    if (exception.getStatus() === 400)
      return response.send(exception.getResponse());
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message
      ? i18n?.translate(`translation.${exception.message}`, {
          lang: i18n.lang,
        })
      : 'Internal server error';
    return response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
