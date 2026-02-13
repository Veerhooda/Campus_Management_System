import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const nodeEnv = configService.get<string>('nodeEnv', 'development');

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // Enable CORS
  app.enableCors({
    origin: nodeEnv === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : true,
    credentials: true,
  });

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  // API prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Environment: ${nodeEnv}`);
}

bootstrap();
