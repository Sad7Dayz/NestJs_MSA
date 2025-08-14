import {
  Controller,
  Post,
  UnauthorizedException,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register-dto';
import {Authorization} from './decorator/authorization.decorator';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {ParseBearerTokenDto} from './dto/parse-bearer-token.dto';
import {RpcInterceptor} from '../../../../libs/common/src/interceptor/rpc.interceptor';

/**
 * 인증 관련 API를 처리하는 컨트롤러
 * /auth 경로로 들어오는 모든 요청을 처리
 */
@Controller('auth')
export class AuthController {
  // AuthService를 의존성 주입으로 받아서 인증 로직 처리
  constructor(private readonly authService: AuthService) {}

  /**
   * 사용자 회원가입 API 엔드포인트
   * POST /auth/register
   *
   * @param token - Authorization 헤더에서 추출한 Basic 토큰
   * @param registerDto - 요청 본문(Body)에서 받은 회원가입 정보
   * @returns 생성된 사용자 정보
   */
  @Post('register')
  @UsePipes(ValidationPipe)
  registerUser(
    @Authorization() token: string, // 커스텀 데코레이터로 Authorization 헤더 추출
    @Body() registerDto: RegisterDto, // 요청 본문에서 회원가입 정보 추출
  ) {
    // 토큰이 없으면 401 Unauthorized 에러 발생
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }

    // AuthService의 register 메서드 호출하여 회원가입 처리
    return this.authService.register(token, registerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginUser(@Authorization() token: string) {
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }
    return this.authService.login(token);
  }

  @MessagePattern({
    cmd: 'parse_bearer_token',
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }
}
