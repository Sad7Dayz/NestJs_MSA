import {UserMicroservice} from '@app/common';
import {Controller, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';

/**
 * 인증 관련 API를 처리하는 컨트롤러
 * /auth 경로로 들어오는 모든 요청을 처리
 */
@Controller('auth')
@UserMicroservice.AuthServiceControllerMethods()
export class AuthController implements UserMicroservice.AuthServiceController {
  // AuthService를 의존성 주입으로 받아서 인증 로직 처리
  constructor(private readonly authService: AuthService) {}

  parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }

  //오류??
  registerUser(
    request: UserMicroservice.RegisterUserRequest, // 요청 본문에서 회원가입 정보 추출
  ) {
    const {token} = request;
    // 토큰이 없으면 401 Unauthorized 에러 발생
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    // AuthService의 register 메서드 호출하여 회원가입 처리
    return this.authService.register(token, request);
  }

  loginUser(request: UserMicroservice.LoginUserRequest) {
    const {token} = request;
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }
    return this.authService.login(token);
  }
}
