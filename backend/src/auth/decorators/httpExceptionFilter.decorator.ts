
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { responseStatus } from 'src/common/responses/responses';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    //if(exception?.message=!exception?.response?.message)
    const message = exception?.response?.message;

    response
      .status(status)
      .json({
        statusCode: status,
        status: responseStatus.ERROR,
        message: message,
        timestamp: new Date().toISOString(),
        url: request.url,
      });
  }
}