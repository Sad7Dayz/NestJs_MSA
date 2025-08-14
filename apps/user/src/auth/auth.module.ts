import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../user/entity/user.entity';

/**
 * Auth 모듈
 * 인증 관련 모든 기능을 캡슐화하는 NestJS 모듈
 * - 사용자 회원가입/로그인 기능
 * - Basic Authentication 처리
 * - UserModule과의 연동
 */
@Module({
  /**
   * imports: 이 모듈에서 사용할 다른 모듈들을 가져옴
   * UserModule: 사용자 관련 기능을 제공하는 모듈
   * - UserModule에서 export한 UserService를 AuthService에서 사용 가능
   * - AuthService에서 사용자 생성/조회 등의 작업을 UserService에 위임
   */
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],

  /**
   * controllers: 이 모듈에서 제공하는 컨트롤러들
   * AuthController: /auth 경로의 HTTP 요청을 처리하는 컨트롤러
   * - POST /auth/register (회원가입)
   * - POST /auth/login (로그인) 등의 엔드포인트 제공
   */
  controllers: [AuthController],

  /**
   * providers: 이 모듈에서 제공하는 서비스들 (의존성 주입 가능한 클래스들)
   * AuthService: 인증 관련 비즈니스 로직을 처리하는 서비스
   * - Basic Token 파싱
   * - 회원가입 로직
   * - 로그인 인증 로직 등
   */
  providers: [AuthService],
})
export class AuthModule {}
