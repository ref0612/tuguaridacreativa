import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuración de seguridad con Helmet
  if (configService.get('HELMET_ENABLED') === 'true') {
    app.use(helmet());
  }

  // Configuración de CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Configuración de CSRF
  if (configService.get('CSRF_ENABLED') === 'true') {
    app.use(csurf());
  }

  // Configuración de rate limiting
  app.use(
    rateLimit({
      windowMs: configService.get('RATE_LIMIT_TTL', 60) * 1000,
      max: configService.get('RATE_LIMIT_LIMIT', 100),
    }),
  );

  // Compresión de respuestas
  app.use(compression());

  // Interceptores globales
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configuración de prefijo global para las rutas de la API
  app.setGlobalPrefix('api');

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger
  if (configService.get('SWAGGER_ENABLED') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('APP_NAME') || 'API')
      .setDescription(`API Documentation`)
      .setVersion(configService.get('APP_VERSION') || '1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(
      configService.get('SWAGGER_PATH', 'api/docs'),
      app,
      document,
      {
        swaggerOptions: {
          persistAuthorization: true,
        },
      },
    );
  }

  // Iniciar la aplicación
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación de la API: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
