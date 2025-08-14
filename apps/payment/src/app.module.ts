import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as Joi from 'joi';
import {PaymentModule} from './payment/payment.module';
import {ClientsModule} from '@nestjs/microservices/module/clients.module';
import {NOTIFICATION_SERVICE} from '@app/common';
import {Transport} from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(), // 데이터베이스 URL (문자열, 필수)
      }),
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // 데이터베이스 타입: PostgreSQL
        url: configService.getOrThrow('DB_URL'), // DB 연결 URL (환경변수에서 가져옴)
        autoLoadEntities: true, // 엔티티 자동 로드 (true: 등록된 엔티티 자동 감지)
        synchronize: true, // 스키마 자동 동기화 (개발환경용, 운영환경에서는 false 권장)
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('NOTIFICATION_HOST'),
              port: configService.getOrThrow<number>('NOTIFICATION_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    PaymentModule,
  ],
})
export class AppModule {}
