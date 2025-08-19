import {ORDER_SERVICE, OrderMicroservice} from '@app/common';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {MongooseModule} from '@nestjs/mongoose';
import * as Joi from 'joi';
import {join} from 'path';
import {NotificationModule} from './notification/notification.module';

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
            transport: Transport.GRPC,
            options: {
              package: OrderMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/order.proto'),
              url: configService.getOrThrow('ORDER_GRPC_URL'),
              // urls: ['amqp://rabbitmq:5672'],
              // queue: 'order_queue',
              // queueOptions: {
              //   durable: false,
              // },

              // host: 'redis',
              // port: 6379,

              //ApiGateway에서 Order 마이크로서비스
              // host: configService.getOrThrow<string>('ORDER_HOST'),
              // port: configService.getOrThrow<number>('ORDER_TCP_PORT'),
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
