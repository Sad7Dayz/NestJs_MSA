import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

/**
 * User 엔티티 클래스
 * 데이터베이스의 'user' 테이블과 매핑되는 엔티티
 */
@Entity()
export class User {
  /**
   * 기본 키 (Primary Key)
   * UUID 형식으로 자동 생성되는 고유 식별자
   * 예: "550e8400-e29b-41d4-a716-446655440000"
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 이메일 주소
   * unique: true - 중복 불가 (유니크 제약조건)
   * 로그인 아이디로 사용
   */
  @Column({
    unique: true,
  })
  email: string;

  /**
   * 사용자 이름
   * 일반 문자열 컬럼
   */
  @Column()
  name: string;

  /**
   * 사용자 나이
   * 숫자 타입 컬럼
   */
  @Column()
  age: number;

  /**
   * 프로필 정보
   * 프로필 이미지 URL 또는 설명 등을 저장
   */
  @Column()
  profile: string;

  /**
   * 비밀번호
   * select: false - 기본 조회 시 제외됨 (보안상 중요)
   * 명시적으로 선택하지 않는 한 조회 결과에 포함되지 않음
   */
  @Column({
    select: false,
  })
  password: string;

  /**
   * 생성일시
   * 레코드가 생성될 때 자동으로 현재 시간이 설정됨
   * INSERT 시에만 설정되고 이후 변경되지 않음
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 수정일시
   * 레코드가 수정될 때마다 자동으로 현재 시간으로 업데이트됨
   * INSERT, UPDATE 시마다 갱신됨
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 버전 번호
   * 낙관적 잠금(Optimistic Locking)을 위한 필드
   * 레코드가 수정될 때마다 자동으로 증가
   * 동시성 제어에 사용됨
   */
  @VersionColumn()
  version: number;
}
