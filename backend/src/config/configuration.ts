import * as Joi from 'joi';

export default () => ({
  // Configuración de la aplicación
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Custom CRM + eCommerce',
  appVersion: process.env.APP_VERSION || '1.0.0',
  appDescription: 'Sistema de CRM + eCommerce personalizado',
  
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  
  // Configuración de la base de datos
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'custom_crm',
    synchronize: process.env.DB_SYNC === 'true' || false,
    logging: process.env.DB_LOGGING === 'true' || false,
  },
  
  // Configuración de AWS S3 (para almacenamiento de archivos)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME || 'custom-crm-ecommerce',
      publicUrl: process.env.AWS_S3_PUBLIC_URL,
    },
  },
  
  // Configuración de correo electrónico
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'no-reply@customcrm.com',
  },
  
  // Configuración de la URL del frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  
  // Configuración de la URL de la API
  apiUrl: process.env.API_URL || 'http://localhost:3000',
});

export const validationSchema = Joi.object({
  // Validación de variables de entorno
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  
  // Validación de la base de datos
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  
  // Validación de JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // Validación de AWS
  AWS_ACCESS_KEY_ID: Joi.string(),
  AWS_SECRET_ACCESS_KEY: Joi.string(),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_S3_BUCKET_NAME: Joi.string(),
  AWS_S3_PUBLIC_URL: Joi.string(),
  
  // Validación de correo electrónico
  EMAIL_HOST: Joi.string(),
  EMAIL_PORT: Joi.number().default(587),
  EMAIL_SECURE: Joi.boolean().default(false),
  EMAIL_USER: Joi.string(),
  EMAIL_PASSWORD: Joi.string(),
  EMAIL_FROM: Joi.string(),
  
  // Validación de URLs
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
  API_URL: Joi.string().default('http://localhost:3000'),
  
  // Validación de CORS
  CORS_ORIGIN: Joi.string().default('*'),
});
