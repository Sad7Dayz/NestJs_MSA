import {NotificationMicroservice} from '@app/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: NotificationMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/notification.proto'),
      url: configService.getOrThrow('GRPC_URL'),

      // RabbitMQ 설정
      // urls: ['amqp://rabbitmq:5672'],
      // queue: 'notification_queue',
      // queueOptions: {
      //   durable: false,
      // },

      // redis를 사용하여 마이크로서비스 간 통신을 설정합니다.
      // host: 'redis',
      // port: 6379,

      //Api Gateway에서 Notification 마이크로서비스
      // host: '0.0.0.0',
      // port: parseInt(process.env.TCP_PORT || '3001', 10),
    },
  });
  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
