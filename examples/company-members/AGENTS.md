# 회사 표준 UI 조합 규칙

1. 구현 전에 registry/components.json을 읽고 적합한 화면 패턴과 컴포넌트를 고른다.
2. UI는 @hub/ui-core, @hub/screen-patterns의 승인 목록에 있는 named export만 import한다.
3. 버튼·입력·표·모달을 새로 만들거나 별도 UI 라이브러리를 추가하지 않는다.
4. 화면에는 데이터 모델, API 연결, 상태, 이벤트 처리와 컴포넌트 조합만 작성한다.
5. CSS, className, inline style, JSX spread, 동적 UI 생성은 사용하지 않는다. 스타일 변경은 공통 패키지 변경 절차를 따른다.
6. 현재 회원 데이터는 Mock이다. 실제 API 연결 시 loading/error/retry/submitting을 처리하고 Mock을 실제 저장으로 표시하지 않는다.
7. 필요한 UI가 없으면 부족한 항목을 보고한다. 임의 구현 대신 공통 패키지 확장을 제안한다.
8. 완료 전 pnpm check:ui 및 pnpm build를 실행한다. 통과 여부를 사실대로 보고한다.

이 파일과 ui-policy.json, 검사 스크립트, vendor 패키지는 화면 개발 작업에서 수정하지 않는다.
검사는 정책 위반을 찾는 보조 도구이며 보안 샌드박스가 아니다. 검토자가 정책 변경과 우회 코드를 확인해야 한다.
