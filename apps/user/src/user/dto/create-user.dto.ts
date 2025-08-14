import {IsEmail, IsNumber, IsString, IsNotEmpty} from 'class-validator';

/**
 * 사용자 생성 DTO (Data Transfer Object)
 * 클라이언트에서 사용자 생성 요청 시 전달되는 데이터의 구조와 검증 규칙 정의
 * HTTP 요청 Body의 데이터 검증 및 타입 안전성 보장
 * {
 * "email": "user@example.com",
 * "password": "securePassword123",
 * "name": "홍길동",
 * "age": 25,
 * "profile": "안녕하세요, 개발자입니다."
 *}
 */
export class CreateUserDto {
  /**
   * 이메일 주소
   * @IsEmail() - 올바른 이메일 형식인지 검증
   * @IsNotEmpty() - 빈 값이 아닌지 검증
   * 예: "user@example.com"
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * 비밀번호
   * @IsString() - 문자열 타입인지 검증
   * @IsNotEmpty() - 빈 값이 아닌지 검증
   * 최소 길이, 복잡성 등 추가 검증 규칙을 넣을 수 있음
   */
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * 사용자 이름
   * @IsString() - 문자열 타입인지 검증
   * @IsNotEmpty() - 빈 값이 아닌지 검증
   * 예: "홍길동"
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 나이
   * @IsNumber() - 숫자 타입인지 검증
   * @IsNotEmpty() - 빈 값이 아닌지 검증
   * 예: 25
   */
  @IsNumber()
  @IsNotEmpty()
  age: number;

  /**
   * 프로필 정보
   * @IsString() - 문자열 타입인지 검증
   * @IsNotEmpty() - 빈 값이 아닌지 검증
   * 프로필 이미지 URL, 자기소개 등을 저장
   * 예: "안녕하세요, 개발자입니다."
   */
  @IsString()
  @IsNotEmpty()
  profile: string;
}
