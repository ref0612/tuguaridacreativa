import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let validationErrors: string[] = [];

    // Manejar excepciones de validación
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      
      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || message;
        error = (response as any).error || error;
        
        // Extraer mensajes de validación
        if (Array.isArray((response as any).message)) {
          validationErrors = (response as any).message;
        }
      } else if (typeof response === 'string') {
        message = response;
      }
    } 
    // Manejar errores de TypeORM
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = ERROR_MESSAGES.DATABASE_ERROR;
      error = exception.message;
      
      // Manejar errores de restricción única
      if (exception.message.includes('duplicate key')) {
        message = 'El registro ya existe';
        error = 'Duplicate Key Error';
      }
    } 
    // Manejar errores de entidad no encontrada
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = ERROR_MESSAGES.RESOURCE_NOT_FOUND;
      error = 'Not Found';
    } 
    // Manejar otros errores inesperados
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Registrar el error
    this.logError(exception, request);

    // Enviar respuesta al cliente
    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(validationErrors.length > 0 && { errors: validationErrors }),
    });
  }

  private logError(exception: unknown, request: Request) {
    const { method, url, body, user } = request as any;
    const userInfo = user ? `[User: ${JSON.stringify(user)}]` : '[Unauthenticated]';
    
    this.logger.error(
      `${method} ${url} ${userInfo}\n` +
      `Body: ${JSON.stringify(body)}\n` +
      `Error: ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}`,
    );
  }
}
