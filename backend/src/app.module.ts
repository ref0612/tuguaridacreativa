import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    CommonModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
