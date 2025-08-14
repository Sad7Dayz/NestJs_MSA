import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {RegisterDto} from './dto/register-dto';
import {Repository} from 'typeorm';
import {User} from '../user/entity/user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // UserService를 의존성 주입으로 받아서 사용자 관련 작업 처리
  constructor(
    private readonly userService: UserService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * 사용자 회원가입 메서드
   * @param rawToken - Basic Authentication 토큰 (예: "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==")
   * @param registerDto - 회원가입에 필요한 추가 정보 (이름, 전화번호 등)
   * @returns 생성된 사용자 정보
   */
  async register(rawToken: string, registerDto: RegisterDto) {
    // Basic 토큰에서 이메일과 패스워드 추출
    const {email, password} = this.parseBasicToken(rawToken);

    // UserService를 통해 사용자 생성
    // registerDto의 정보와 토큰에서 추출한 email, password를 합쳐서 전달
    return this.userService.create({
      ...registerDto,
      email,
      password,
    });
  }

  /**
   * Basic Authentication 토큰을 파싱하는 메서드
   * Basic 토큰 형식: "Basic base64(email:password)"
   * @param rawToken - 원본 토큰 문자열
   * @returns {email, password} 객체
   */
  parseBasicToken(rawToken: string) {
    // 1단계: "Basic "과 토큰 부분을 분리
    // 예: "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==" → ["Basic", "dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA=="]
    const basicSplit = rawToken.split(' ');

    // 토큰이 정확히 2개 부분으로 나뉘지 않으면 오류
    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [basic, token] = basicSplit;

    // 첫 번째 부분이 "basic"이 아니면 오류 (대소문자 구분 없음)
    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    // 2단계: Base64로 인코딩된 토큰을 디코딩
    // 예: "dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA==" → "user@example.com:password"
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    // 3단계: 디코딩된 문자열을 ':'로 분리하여 이메일과 패스워드 추출
    // 예: "user@example.com:password" → ["user@example.com", "password"]
    const tokenSplit = decoded.split(':');

    // 이메일:패스워드 형식이 아니면 오류
    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [email, password] = tokenSplit;

    // 추출된 이메일과 패스워드 반환
    return {
      email,
      password,
    };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          isRefreshToken ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET',
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== 'refresh') {
          throw new BadRequestException('Refresh 토큰을 입력해주세요!');
        }
      } else {
        if (payload.type !== 'access') {
          throw new BadRequestException('Access 토큰을 입력해주세요!');
        }
      }

      return payload;
    } catch (e) {
      throw new UnauthorizedException('토큰이 만료 됐습니다.');
    }
  }

  async login(rawToken: string) {
    const {email, password} = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    return user;
  }

  async issueToken(user: any, isRefreshToken: boolean) {
    const refreshTokenSecret = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const accessTokenSecret = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );

    return this.jwtService.signAsync(
      {
        sub: user.id ?? user.sub,
        role: user.role,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: '3600h',
      },
    );
  }
}
