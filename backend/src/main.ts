import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet'; // Importación corregida para TypeScript
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
    // Parse cookies first
    app.use(cookieParser());
    // Then setup CSRF protection
    const csrfProtection = csrf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      }
    });
    app.use(csrfProtection);
  }

  // Configuración de rate limiting
  try {
    const limiter = rateLimit({
      windowMs: Number(configService.get('RATE_LIMIT_TTL', '60')) * 1000,
      max: Number(configService.get('RATE_LIMIT_LIMIT', '100')),
      message: { message: 'Demasiadas solicitudes, por favor intente más tarde' },
    });
    app.use(limiter);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.warn('Error al configurar el rate limiting:', errorMessage);
  }

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
      .setDescription('API Documentation')
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
      }
    );
  }

  // Configuración de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Validar variables de entorno requeridas
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !configService.get(envVar));
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`);
  }

  // Iniciar la aplicación
  const port = Number(configService.get('PORT', '3000'));
  await app.listen(port);
  
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  if (configService.get('SWAGGER_ENABLED') === 'true') {
    console.log(`📚 Documentación de la API: http://localhost:${port}${configService.get('SWAGGER_PATH', '/api/docs')}`);
  }
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
