import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonasModule } from './personas/personas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const integratedSecurity =
          (
            configService.get<string>('DB_INTEGRATED_SECURITY', 'false') ??
            'false'
          ).toLowerCase() === 'true';
        const synchronize =
          (
            configService.get<string>('DB_SYNCHRONIZE', 'true') ?? 'true'
          ).toLowerCase() === 'true';

        return {
          type: 'mssql' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<string>('DB_PORT', '1433')),
          username: configService.get<string>('DB_USERNAME', 'sa'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'people_db'),
          synchronize,
          autoLoadEntities: true,
          options: {
            encrypt:
              (
                configService.get<string>('DB_ENCRYPT', 'false') ?? 'false'
              ).toLowerCase() === 'true',
            trustServerCertificate:
              (
                configService.get<string>(
                  'DB_TRUST_SERVER_CERTIFICATE',
                  'true',
                ) ?? 'true'
              ).toLowerCase() === 'true',
            ...(integratedSecurity ? { integratedSecurity: true } : {}),
          },
        };
      },
    }),
    PersonasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
