import {Module} from '@nestjs/common';
import {ProductModule} from './product/product.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(), // HTTP 서버 포트 (숫자, 필수)
        DB_URL: Joi.string().required(), // 데이터베이스 URL (문자열, 필수)
        TCP_PORT: Joi.number().required(),
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
    ProductModule,
  ],
})
export class AppModule {}
