import {PAYMENT_SERVICE, PRODUCT_SERVICE, USER_SERVICE} from '@app/common';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {MongooseModule} from '@nestjs/mongoose';
import * as Joi from 'joi';
import {OrderModule} from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(), // HTTP 서버 포트 (숫자, 필수)
        USER_HOST: Joi.string().required(), // User 마이크로서비스 호스트
        USER_TCP_PORT: Joi.number().required(), // User 마이크로서비스 TCP 포트
        DB_URL: Joi.string().required(), // 데이터베이스 URL (문자열, 필수)
        PRODUCT_HOST: Joi.string().required(), // Product 마이크로서비스 호스트
        PRODUCT_TCP_PORT: Joi.number().required(), // Product 마이크로서비스 TCP 포트
        PAYMENT_HOST: Joi.string().required(), // Payment 마이크로서비스 호스트
        PAYMENT_TCP_PORT: Joi.number().required(), // Payment 마이크로서비스 TCP 포트
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
          name: USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'user_queue',
              queueOptions: {
                durable: false,
              },
              // host: 'redis',
              // port: 6379,
              // host: configService.getOrThrow<string>('USER_HOST'),
              // port: configService.getOrThrow<number>('USER_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PRODUCT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'product_queue',
              queueOptions: {
                durable: false,
              },

              // redis를 사용하여 마이크로서비스 간 통신을 설정합니다.
              // host: 'redis',
              // port: 6379,

              //ApiGateway에서 Product 마이크로서비스
              // host: configService.getOrThrow<string>('PRODUCT_HOST'),
              // port: configService.getOrThrow<number>('PRODUCT_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PAYMENT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: 'payment_queue',
              queueOptions: {
                durable: false,
              },

              // redis를 사용하여 마이크로서비스 간 통신을 설정합니다.
              // host: 'redis',
              // port: 6379,

              //ApiGateway에서 Payment 마이크로서비스
              // host: configService.getOrThrow<string>('PAYMENT_HOST'),
              // port: configService.getOrThrow<number>('PAYMENT_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    OrderModule,
  ],
})
export class AppModule {}
