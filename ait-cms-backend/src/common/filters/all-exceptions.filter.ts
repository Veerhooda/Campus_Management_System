import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request.url);

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${errorResponse.statusCode}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    path: string,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();

    // Handle HTTP exceptions (NestJS built-in)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      let message: string | string[];
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string | string[]) || exception.message;
      } else {
        message = exception.message;
      }

      return {
        statusCode: status,
        message,
        error: HttpStatus[status] || 'Error',
        timestamp,
        path,
      };
    }

    // Handle Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, timestamp, path);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid data provided',
        error: 'Bad Request',
        timestamp,
        path,
      };
    }

    // Handle generic errors
    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          process.env.NODE_ENV === 'development'
            ? exception.message
            : 'Internal server error',
        error: 'Internal Server Error',
        timestamp,
        path,
      };
    }

    // Unknown error type
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp,
      path,
    };
  }

  private handlePrismaError(
    error: Prisma.PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
  ): ErrorResponse {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || [];
        return {
          statusCode: HttpStatus.CONFLICT,
          message: `Duplicate value for field(s): ${target.join(', ')}`,
          error: 'Conflict',
          timestamp,
          path,
        };
      }
      case 'P2003': {
        // Foreign key constraint violation
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Referenced record does not exist',
          error: 'Bad Request',
          timestamp,
          path,
        };
      }
      case 'P2025': {
        // Record not found
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'Not Found',
          timestamp,
          path,
        };
      }
      default: {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Database operation failed',
          error: 'Bad Request',
          timestamp,
          path,
        };
      }
    }
  }
}
