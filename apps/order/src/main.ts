import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'order_queue',
      queueOptions: {
        durable: false,
      },

      // redis를 사용하여 마이크로서비스 간 통신을 설정합니다.
      // host: 'redis',
      // port: 6379,

      //ApiGateway에서 Order 마이크로서비스
      // host: '0.0.0.0',
      // port: parseInt(process.env.TCP_PORT || '3001', 10),
    },
  });

  await app.startAllMicroservices();
  //await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
