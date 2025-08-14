import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

/**
 * 회원가입 DTO (Data Transfer Object)
 * 회원가입 요청 시 클라이언트에서 전달하는 추가 정보를 정의
 * email과 password는 Authorization 헤더에서 추출하므로 여기에는 포함되지 않음
 */
export class RegisterDto {
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
   * 사용자 나이
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
