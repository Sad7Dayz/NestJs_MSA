import {Body, Controller, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Authorization} from './decorator/authorization.decorator';
import {RegisterDto} from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  loginUser(@Authorization() token: string) {
    if (token === null) {
      throw new UnauthorizedException('토큰을 입력해주세요!');
    }
    return this.authService.login(token);
  }
}
