import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entity/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스
 * 데이터베이스 CRUD 작업 및 비밀번호 암호화 등을 담당
 */
@Injectable()
export class UserService {
  /**
   * 생성자: UserRepository를 의존성 주입으로 받음
   * @InjectRepository(User): User 엔티티에 대한 TypeORM Repository 주입
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.findOneBy({id: userId});
    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  /**
   * 새 사용자를 생성하는 메서드
   * @param createUserDto - 사용자 생성에 필요한 정보 (이메일, 비밀번호, 이름 등)
   * @returns 생성된 사용자 정보 (비밀번호 제외)
   */
  async create(createUserDto: CreateUserDto) {
    // DTO에서 이메일과 비밀번호 추출
    const {email, password} = createUserDto;

    // 1단계: 이메일 중복 확인
    // 동일한 이메일로 가입된 사용자가 있는지 데이터베이스에서 조회
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    // 이미 가입된 이메일이면 에러 발생
    if (user) {
      throw new Error('이미 가입한 이메일입니다.');
    }

    // 2단계: 비밀번호 암호화
    // bcrypt를 사용하여 비밀번호를 해시화 (salt rounds: 10)
    // 원본 비밀번호는 저장하지 않고 해시된 값만 저장
    const hash = await bcrypt.hash(password, 10);

    // 3단계: 사용자 정보 데이터베이스에 저장
    // createUserDto의 모든 정보와 암호화된 비밀번호를 함께 저장
    await this.userRepository.save({
      ...createUserDto, // 이름, 나이, 프로필 등의 다른 정보
      email, // 이메일
      password: hash, // 암호화된 비밀번호
    });

    // 4단계: 저장된 사용자 정보 조회하여 반환
    // password는 select: false 설정으로 인해 자동으로 제외됨
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
