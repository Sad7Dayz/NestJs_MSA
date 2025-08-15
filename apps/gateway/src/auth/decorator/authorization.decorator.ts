import {createParamDecorator, ExecutionContext} from '@nestjs/common';

/**
 * Authorization 헤더를 추출하는 커스텀 파라미터 데코레이터
 * HTTP 요청의 Authorization 헤더 값을 컨트롤러 메서드의 파라미터로 직접 주입
 *
 * 사용 예시:
 * @Post('register')
 * async register(@Authorization() token: string, @Body() dto: RegisterDto) {
 *   // token = "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA=="
 * }
 */
export const Authorization = createParamDecorator(
  /**
   * 데코레이터 실행 함수
   * @param data - 데코레이터에 전달된 추가 데이터 (현재 사용하지 않음)
   * @param context - NestJS 실행 컨텍스트 (요청/응답 정보 포함)
   * @returns Authorization 헤더의 값 (string | undefined)
   */
  (data: any, context: ExecutionContext) => {
    // ExecutionContext에서 HTTP 요청 객체 추출
    const req = context.switchToHttp().getRequest();

    // 요청 헤더에서 'authorization' 필드 값 반환
    // 예: "Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZA=="
    return req.headers['authorization'];
  },
);
