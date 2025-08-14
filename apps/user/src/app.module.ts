import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import * as Joi from 'joi';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

/**
 * 애플리케이션의 루트 모듈
 * 전체 애플리케이션의 설정과 모든 기능 모듈들을 통합하는 최상위 모듈
 * - 환경변수 설정 및 검증
 * - 데이터베이스 연결 설정
 * - 기능 모듈들의 통합
 */
@Module({
  imports: [
    /**
     * ConfigModule: 환경변수 관리 모듈
     * - 환경변수 파일(.env)을 읽어서 애플리케이션 전체에서 사용 가능하게 함
     */
    ConfigModule.forRoot({
      /**
       * isGlobal: true - 전역 모듈로 설정
       * 다른 모듈에서 ConfigModule을 import하지 않아도 ConfigService 사용 가능
       */
      isGlobal: true,

      /**
       * validationSchema: 환경변수 검증 스키마
       * Joi 라이브러리를 사용하여 환경변수의 타입과 필수값 검증
       * 애플리케이션 시작 시 환경변수가 올바르지 않으면 에러 발생
       */
      validationSchema: Joi.object({
        REFRESH_TOKEN_SECRET: Joi.string().required(), // 리프레시 토큰 비밀키 (문자열, 필수)
        ACCESS_TOKEN_SECRET: Joi.string().required(), // 액세스 토큰 비밀키 (문자열, 필수)
        HTTP_PORT: Joi.number().required(), // HTTP 포트 번호 (숫자, 필수)
        DB_URL: Joi.string().required(), // 데이터베이스 URL (문자열, 필수)
      }),
    }),

    /**
     * TypeOrmModule: 데이터베이스 ORM 설정
     * forRootAsync: 비동기적으로 설정을 불러옴 (ConfigService 의존성 필요)
     */
    TypeOrmModule.forRootAsync({
      /**
       * useFactory: 팩토리 함수를 사용하여 TypeORM 설정 객체 생성
       * ConfigService를 주입받아 환경변수에서 DB 설정 값들을 가져옴
       */
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // 데이터베이스 타입: PostgreSQL
        url: configService.getOrThrow('DB_URL'), // DB 연결 URL (환경변수에서 가져옴)
        autoLoadEntities: true, // 엔티티 자동 로드 (true: 등록된 엔티티 자동 감지)
        synchronize: true, // 스키마 자동 동기화 (개발환경용, 운영환경에서는 false 권장)
      }),
      /**
       * inject: 팩토리 함수에 주입할 의존성들
       * ConfigService를 주입하여 useFactory에서 사용
       */
      inject: [ConfigService],
    }),

    /**
     * 기능 모듈들 등록
     * UserModule: 사용자 관련 기능 (CRUD, 엔티티 등)
     * AuthModule: 인증 관련 기능 (회원가입, 로그인 등)
     */
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
