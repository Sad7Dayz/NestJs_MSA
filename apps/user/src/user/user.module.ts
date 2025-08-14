import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entity/user.entity';

/**
 * User 모듈
 * 사용자 관련 모든 기능을 캡슐화하는 NestJS 모듈
 * - 사용자 CRUD 기능
 * - 데이터베이스 연동
 * - 의존성 주입 설정
 */
@Module({
  /**
   * imports: 이 모듈에서 사용할 다른 모듈들을 가져옴
   * TypeOrmModule.forFeature([User]): User 엔티티에 대한 Repository를 등록
   * - User 엔티티와 연결된 데이터베이스 Repository를 DI 컨테이너에 등록
   * - UserService에서 @InjectRepository(User)로 사용 가능하게 됨
   */
  imports: [TypeOrmModule.forFeature([User])],

  /**
   * controllers: 이 모듈에서 제공하는 컨트롤러들
   * UserController: /user 경로의 HTTP 요청을 처리하는 컨트롤러
   */
  controllers: [UserController],

  /**
   * providers: 이 모듈에서 제공하는 서비스들 (의존성 주입 가능한 클래스들)
   * UserService: 사용자 관련 비즈니스 로직을 처리하는 서비스
   */
  providers: [UserService],

  /**
   * exports: 다른 모듈에서 사용할 수 있도록 내보내는 서비스들
   * UserService를 export하여 다른 모듈(예: AuthModule)에서 import하여 사용 가능
   * 예: AuthService에서 UserService를 의존성 주입으로 사용
   */
  exports: [UserService],
})
export class UserModule {}
