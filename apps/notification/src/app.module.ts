import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as Joi from 'joi';
import {MongooseModule} from '@nestjs/mongoose';
import {NotificationModule} from './notification/notification.module';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ORDER_SERVICE} from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(), // 데이터베이스 URL (문자열, 필수)
        TCP_PORT: Joi.number().required(),
        ORDER_HOST: Joi.string().required(),
        ORDER_TCP_PORT: Joi.string().required(),
      }),
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ORDER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('ORDER_HOST'),
              port: configService.getOrThrow<number>('ORDER_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    NotificationModule,
  ],
})
export class AppModule {}
