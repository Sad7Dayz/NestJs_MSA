import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {UserService} from './user.service';
import {MessagePattern} from '@nestjs/microservices/decorators/message-pattern.decorator';
import {RpcInterceptor} from '../../../../libs/common/src/interceptor/rpc.interceptor';
import {GetUserInfoDto} from './dto/get-user-info.dto';
import {Payload} from '@nestjs/microservices';

/**
 * User 컨트롤러
 * 사용자 관련 HTTP 요청을 처리하는 컨트롤러
 * 기본 경로: / (루트 경로)
 */
@Controller()
export class UserController {
  /**
   * 생성자: UserService를 의존성 주입으로 받음
   * @param userService - 사용자 관련 비즈니스 로직을 처리하는 서비스
   */
  constructor(private readonly userService: UserService) {}

  @MessagePattern({cmd: 'get_user_info'})
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  getUserInfo(@Payload() data: GetUserInfoDto) {
    return this.userService.getUserById(data.userId);
  }
}
