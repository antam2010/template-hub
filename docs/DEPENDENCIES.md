# 호환성 및 공식 참고 자료

최신 major로 일괄 교체하지 않고 아래 조합을 설치하고 실제 타입·빌드·실행 검증했습니다. 전체 전이 의존성은 루트 `pnpm-lock.yaml`을 기준으로 합니다. 생성 프로젝트는 직접 의존성을 정확한 버전으로 지정하고 첫 설치에서 별도 lockfile을 만듭니다.

| 분류                                  | 버전                          | 확인                                   |
| ------------------------------------- | ----------------------------- | -------------------------------------- |
| Node / pnpm                           | 24.22.1 / 11.25.0             | Node 22.12+ 지원 대상                  |
| React / React DOM                     | 19.3.1                        | 동일 버전                              |
| Vite / React plugin                   | 7.3.7 / 5.2.0                 | Storybook 10의 Vite 7 지원 범위와 일치 |
| TypeScript                            | 5.9.3                         | strict / Bundler 모듈 해석             |
| Tailwind / Vite plugin                | 4.3.3 / 4.3.3                 | CSS-first theme 및 Vite plugin         |
| React Router DOM                      | 7.18.5                        | 선언형 BrowserRouter                   |
| Cloudscape components / global styles | 3.0.1406 / 1.0.71             | React peer 범위 확인; 별도 문서 로드   |
| Radix Dialog / Tabs / Checkbox / Slot | 1.3.1 / 1.2.1 / 1.4.1 / 1.5.0 | React 19 타입/실제 브라우저 확인       |
| Storybook / React Vite / a11y         | 10.6.5                        | 세 패키지 일치, 정적 빌드 확인         |
| Vitest / Playwright                   | 3.2.7 / 1.56.1                | 단위 및 실제 Chromium 실행             |
| Lucide / JSZip                        | 0.468.0 / 3.10.1              | 아이콘 및 브라우저 ZIP 다운로드        |
| Noto Sans KR Variable                 | 5.3.1                         | 로컬 번들 한국어 글꼴                  |

공식 문서:

- [Vite 시작하기](https://vite.dev/guide/)
- [Tailwind CSS의 Vite 설치](https://tailwindcss.com/docs/installation/using-vite)
- [shadcn/ui의 Vite 설정](https://ui.shadcn.com/docs/installation/vite)
- [shadcn/ui Tailwind v4 및 React 19](https://ui.shadcn.com/docs/tailwind-v4)
- [React Router 선언형 설치](https://reactrouter.com/start/declarative/installation)
- [Cloudscape 컴포넌트와 글로벌 스타일](https://cloudscape.design/get-started/for-developers/using-cloudscape-components/)
- [Cloudscape 테마와 typography token](https://cloudscape.design/foundation/visual-foundation/theming/)
- [Storybook React + Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)
- [Vitest 시작하기](https://vitest.dev/guide/)
- [Playwright Web server](https://playwright.dev/docs/test-webserver)

shadcn/ui는 런타임 npm 패키지 설치 방식이 아니라 소스 소유 방식입니다. 이 프로젝트의 Button은 공식 구성 방식인 Radix Slot/CVA/cn을 사용하며, Dialog/Tabs/Checkbox는 Radix 기반으로 제공합니다. 코드와 `components.json`을 저장소 안에서 관리합니다.
