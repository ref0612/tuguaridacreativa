"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    if (configService.get('HELMET_ENABLED') === 'true') {
        app.use((0, helmet_1.default)());
    }
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: true,
    });
    if (configService.get('CSRF_ENABLED') === 'true') {
        app.use((0, cookie_parser_1.default)());
        const csrfProtection = (0, csurf_1.default)({
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            }
        });
        app.use(csrfProtection);
    }
    try {
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: Number(configService.get('RATE_LIMIT_TTL', '60')) * 1000,
            max: Number(configService.get('RATE_LIMIT_LIMIT', '100')),
            message: { message: 'Demasiadas solicitudes, por favor intente más tarde' },
        });
        app.use(limiter);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.warn('Error al configurar el rate limiting:', errorMessage);
    }
    app.use((0, compression_1.default)());
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    if (configService.get('SWAGGER_ENABLED') === 'true') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle(configService.get('APP_NAME') || 'API')
            .setDescription('API Documentation')
            .setVersion(configService.get('APP_VERSION') || '1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup(configService.get('SWAGGER_PATH', 'api/docs'), app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !configService.get(envVar));
    if (missingEnvVars.length > 0) {
        throw new Error(`Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`);
    }
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
//# sourceMappingURL=main.js.map