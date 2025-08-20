export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 수정
        'style',    // 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
        'refactor', // 코드 리팩토링
        'test',     // 테스트 코드, 리팩토링 테스트 코드 추가
        'chore',    // 빌드 업무 수정, 패키지 매니저 수정
        'perf',     // 성능 개선
        'ci',       // CI 설정 파일 수정
        'build',    // 빌드 시스템 수정
        'revert'    // 커밋 되돌리기
      ]
    ],
    'subject-max-length': [2, 'always', 50],
    'header-max-length': [2, 'always', 72]
  }
}