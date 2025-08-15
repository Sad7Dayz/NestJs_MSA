import {ORDER_SERVICE, PRODUCT_SERVICE, USER_SERVICE} from '@app/common';
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import * as Joi from 'joi';
import {AuthModule} from './auth/auth.module';
import {BearerTokenMiddleware} from './auth/middleware/bearer-token.middleware';
import {OrderModule} from './order/order.module';
import {ProductModule} from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_HOST: Joi.string().required(), // User 마이크로서비스 호스트
        USER_TCP_PORT: Joi.number().required(), // User 마이크로서비스 TCP 포트
        PRODUCT_HOST: Joi.string().required(), // Product 마이크로서비스 호스트
        PRODUCT_TCP_PORT: Joi.number().required(), // Product 마이크로서비스 TCP 포트
        ORDER_HOST: Joi.string().required(), // Order 마이크로서비스 호스트
        ORDER_TCP_PORT: Joi.number().required(), // Order 마이크로서비스 TCP 포트
      }),
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('USER_HOST'),
              port: configService.getOrThrow<number>('USER_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: PRODUCT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('PRODUCT_HOST'),
              port: configService.getOrThrow<number>('PRODUCT_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        },
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
    OrderModule,
    ProductModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerTokenMiddleware).forRoutes('order');
  }
}
