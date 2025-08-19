import {UserMicroservice} from '@app/common';
import {Controller} from '@nestjs/common';
import {UserService} from './user.service';

/**
 * User 컨트롤러
 * 사용자 관련 HTTP 요청을 처리하는 컨트롤러
 * 기본 경로: / (루트 경로)
 */
@Controller()
@UserMicroservice.UserServiceControllerMethods()
export class UserController implements UserMicroservice.UserServiceController {
  /**
   * 생성자: UserService를 의존성 주입으로 받음
   *  Tcp에서는
   *  @MessagePattern({cmd: 'get_user_info'})
   *  @UsePipes(ValidationPipe)
   *  @UseInterceptors(RpcInterceptor)
   *  getUserInfo(@PayLoad() data: GetUserInfoDto) {
   * @param userService - 사용자 관련 비즈니스 로직을 처리하는 서비스
   */
  constructor(private readonly userService: UserService) {}

  getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return this.userService.getUserById(request.userId);
  }
}
