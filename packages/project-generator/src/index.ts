import JSZip from "jszip";
import type { TemplateId } from "@hub/patterns";
export interface GeneratorOptions {
  name: string;
  template: TemplateId;
  darkMode: boolean;
  includeTests: boolean;
}
export type SourceFiles = Record<string, string>;
export function validateProjectName(name: string) {
  return (
    /^[a-z][a-z0-9-]{0,49}$/.test(name) &&
    ![
      "node_modules",
      "favicon",
      "con",
      "prn",
      "aux",
      "nul",
      "com1",
      "lpt1",
    ].includes(name)
  );
}
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
export async function generateProject(
  options: GeneratorOptions,
  sources: SourceFiles,
) {
  if (!validateProjectName(options.name))
    throw new Error(
      "프로젝트 이름은 영문 소문자로 시작하는 1~50자 소문자·숫자·하이픈이어야 합니다.",
    );
  if (!["cloud-console", "admin-cms", "analytics"].includes(options.template))
    throw new Error("지원하지 않는 템플릿입니다.");
  const cloud = options.template === "cloud-console";
  const zip = new JSZip();
  const files: Record<string, string> = {};
  const read = (path: string) => {
    if (typeof sources[path] !== "string")
      throw new Error(`소스 누락: ${path}`);
    return sources[path]!;
  };
  files["src/App.tsx"] = read(`templates/${options.template}/src/App.tsx`);
  files["src/patterns/index.ts"] = read("packages/patterns/src/index.ts");
  const aliases: Record<string, string> = {
    "@hub/patterns": "./src/patterns/index.ts",
  };
  const dependencies: Record<string, string> = {
    "@fontsource-variable/noto-sans-kr": "5.3.1",
    react: "19.3.1",
    "react-dom": "19.3.1",
    "lucide-react": "0.468.0",
  };
  if (cloud) {
    dependencies["@cloudscape-design/components"] = "3.0.1406";
    dependencies["@cloudscape-design/global-styles"] = "1.0.71";
  } else {
    for (const file of [
      "index.tsx",
      "composites.tsx",
      "pattern-components.tsx",
    ])
      files[`src/ui-core/${file}`] = read(`packages/ui-core/src/${file}`);
    files["src/styles.css"] =
      read("packages/design-tokens/src/index.css").replace(
        /^@source .*;$/gm,
        "",
      ) + '\n@source "./";\n';
    aliases["@hub/ui-core"] = "./src/ui-core/index.tsx";
    Object.assign(dependencies, {
      "@radix-ui/react-dialog": "1.3.1",
      "@radix-ui/react-tabs": "1.2.1",
      "@radix-ui/react-checkbox": "1.4.1",
      "@radix-ui/react-slot": "1.5.0",
      "class-variance-authority": "0.7.1",
      clsx: "2.1.1",
      "tailwind-merge": "3.7.0",
    });
  }
  files["src/main.tsx"] =
    `import {createRoot} from 'react-dom/client';\nimport App from './App';\n${cloud ? "import '@cloudscape-design/global-styles/index.css';\nimport {applyMode, Mode} from '@cloudscape-design/global-styles';" : "import './styles.css';"}\n${options.darkMode ? `let dark=localStorage.getItem('theme')==='dark';\nfunction setTheme(){${cloud ? "applyMode(dark?Mode.Dark:Mode.Light)" : "document.documentElement.classList.toggle('dark',dark)"};localStorage.setItem('theme',dark?'dark':'light')}\nsetTheme();\nconst button=document.createElement('button');button.textContent='테마 전환';button.setAttribute('aria-label','라이트/다크 테마 전환');button.style.cssText='position:fixed;bottom:16px;left:16px;z-index:1000;padding:10px 14px;border:1px solid #888;border-radius:8px;background:#fff;color:#222;cursor:pointer';button.onclick=()=>{dark=!dark;setTheme()};document.body.append(button);` : ""}\ncreateRoot(document.getElementById('root')!).render(<App/>);\n`;
  if (cloud)
    files["src/main.tsx"] =
      "import '@fontsource-variable/noto-sans-kr';\n" + files["src/main.tsx"];
  files["index.html"] =
    `<!doctype html><html lang="ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${options.name}</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;
  const scripts: Record<string, string> = {
    dev: "vite --host 0.0.0.0",
    typecheck: "tsc --noEmit",
    build: "tsc --noEmit && vite build",
    preview: "vite preview",
  };
  const devDependencies: Record<string, string> = {
    typescript: "5.9.3",
    vite: "7.3.7",
    "@vitejs/plugin-react": "5.2.0",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@types/node": "24.19.2",
  };
  if (!cloud)
    Object.assign(devDependencies, {
      tailwindcss: "4.3.3",
      "@tailwindcss/vite": "4.3.3",
    });
  if (options.includeTests) {
    scripts.test = "vitest run";
    devDependencies.vitest = "3.2.7";
    files["src/patterns.test.ts"] =
      "import {test,expect} from 'vitest';\nimport {filterContent,initialContent} from './patterns';\ntest('status filtering preserves matching rows',()=>{const rows=filterContent(initialContent,'','게시');expect(rows.length).toBeGreaterThan(0);expect(rows.every(row=>row.status==='게시')).toBe(true)});\n";
  }
  files["package.json"] = json({
    name: options.name,
    private: true,
    version: "0.1.0",
    type: "module",
    packageManager: "pnpm@11.25.0",
    engines: { node: ">=22.12.0" },
    scripts,
    dependencies,
    devDependencies,
  });
  files["tsconfig.json"] = json({
    compilerOptions: {
      target: "ES2022",
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      allowImportingTsExtensions: true,
      esModuleInterop: true,
      types: ["vite/client", "node"],
      baseUrl: ".",
      paths: Object.fromEntries(
        Object.entries(aliases).map(([a, p]) => [a, [p]]),
      ),
    },
    include: ["src", "vite.config.ts"],
  });
  files["vite.config.ts"] =
    `import {defineConfig} from 'vite';\nimport react from '@vitejs/plugin-react';\nimport {fileURLToPath, URL} from 'node:url';\n${cloud ? "" : "import tailwindcss from '@tailwindcss/vite';"}\nexport default defineConfig({plugins:[react()${cloud ? "" : ",tailwindcss()"}],resolve:{alias:{${Object.entries(
      aliases,
    )
      .map(
        ([a, p]) =>
          `${JSON.stringify(a)}:fileURLToPath(new URL(${JSON.stringify(p)},import.meta.url))`,
      )
      .join(",")}}}});\n`;
  files["README.md"] =
    `# ${options.name}\n\nTemplate Hub의 ${options.template} 실제 구현 소스로 생성한 독립 프로젝트입니다.\n\n## 실행\n\nNode.js 22.12+ 및 pnpm 11.25.0을 설치하세요.\n\n\`\`\`bash\npnpm install\npnpm dev\npnpm build\n${options.includeTests ? "pnpm test\n" : ""}\`\`\`\n\nMock 데이터는 메모리에서 동작하며 새로고침하면 초기화됩니다. API, 인증, 서버 업로드는 포함되어 있지 않습니다.\n\n의존성은 정확한 버전으로 지정했습니다. 첫 설치에서 생성되는 pnpm-lock.yaml을 저장소에 커밋하세요.\n`;
  files["README.md"] +=
    `\n## 기술 스택과 개발 환경\n\n- Node.js: 최소 22.12.0, 권장 24 LTS (검증 24.22.1)\n- pnpm: 11.25.0\n- React / React DOM: ${dependencies.react} / ${dependencies["react-dom"]}\n- TypeScript: ${devDependencies.typescript}\n- Vite: ${devDependencies.vite}\n- UI: ${cloud ? "Cloudscape " + dependencies["@cloudscape-design/components"] : "Tailwind CSS " + devDependencies.tailwindcss + ", 소스 관리형 UI와 Radix"}\n\n## 처음 실행하는 백엔드 개발자에게\n\n1. https://nodejs.org/en/download 에서 Node 24 LTS를 설치하고 새 터미널을 엽니다.\n2. npm install --global pnpm@11.25.0 을 실행합니다.\n3. 이 디렉터리에서 pnpm install, pnpm dev를 실행하고 출력된 Local 주소를 엽니다.\n4. Windows와 WSL 설치는 서로 별개이므로 한 환경에서 설치·실행하세요. PowerShell 실행 정책 오류는 pnpm.cmd 사용으로 해결할 수 있습니다.\n\n## 파일 역할\n\n- package.json: 의존성과 실행 스크립트 (pom.xml과 비슷한 역할)\n- src/App.tsx: 템플릿의 화면·상태·액션\n- src/patterns: Mock 데이터와 공통 함수\n- vite.config.ts / tsconfig.json: 빌드와 경로 별칭\n${cloud ? "- Cloudscape 글로벌 스타일은 이 독립 문서에서만 로드합니다.\n" : "- src/ui-core: 공통 컴포넌트 소스\n- src/styles.css: 디자인 토큰과 Tailwind 4 설정\n"}\n## 실제 백엔드 연결\n\n현재는 메모리 Mock이며 서버 요청을 하지 않습니다. API 계약을 정한 후 src/App.tsx의 조회/저장/수정/삭제를 fetch와 서버 DTO에 맞게 교체하세요. 로컬 개발은 Vite server.proxy로 /api를 백엔드에 전달할 수 있습니다. 운영 환경은 Nginx/API gateway 또는 별도 API 도메인과 CORS 설정이 필요합니다. 인증은 쿠키/토큰 방식과 CSRF 정책을 서버와 함께 정하세요.\n\n.env.local의 VITE_ 접두사 값은 브라우저에 노출됩니다. DB 비밀번호나 비밀키는 넣지 마세요. 환경변수 변경 후 개발 서버를 재시작하세요. Vite proxy는 개발용이며 배포에 자동 반영되지 않습니다.\n\n## 빌드와 배포\n\npnpm build가 만든 dist 전체를 정적 호스팅하세요. pnpm exec vite preview는 빌드 확인용입니다. React Router를 추가했다면 SPA 경로를 index.html로 돌려주는 설정이 필요합니다.\n`;
  files[".nvmrc"] = "24.22.1\n";
  files[".gitignore"] = "node_modules/\ndist/\n.env.local\n.env.*.local\n";
  files["pnpm-workspace.yaml"] =
    "packages: []\nallowBuilds:\n  esbuild: true\n";
  for (const [path, source] of Object.entries(files))
    zip.file(`${options.name}/${path}`, source);
  const bytes = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
  return { bytes, files };
}

export { generateWorkspaceProject } from "./workspace";
