import JSZip from "jszip";
import { generateProject, type SourceFiles } from "./index";
import {
  isTemplateConfig,
  type TemplateConfig,
} from "../../../templates/workspace/src/model";
export async function generateWorkspaceProject(
  options: {
    name: string;
    config: TemplateConfig;
    darkMode: boolean;
    includeTests: boolean;
  },
  sources: SourceFiles,
) {
  if (!isTemplateConfig(options.config))
    throw new Error("템플릿 구성을 확인하세요.");
  const base = await generateProject(
    {
      name: options.name,
      template: "admin-cms",
      darkMode: options.darkMode,
      includeTests: options.includeTests,
    },
    sources,
  );
  const files = { ...base.files };
  const read = (path: string) => {
    if (typeof sources[path] !== "string")
      throw new Error(`소스 누락: ${path}`);
    return sources[path];
  };
  files["src/Workspace.tsx"] = read("templates/workspace/src/App.tsx");
  files["src/model.ts"] = read("templates/workspace/src/model.ts");
  files["src/workspace.css"] = read("templates/workspace/src/workspace.css");
  files["src/App.tsx"] =
    `import WorkspaceTemplate from './Workspace';\nimport type {TemplateConfig} from './model';\nconst config:TemplateConfig=${JSON.stringify(options.config, null, 2)};\nexport default function App(){return <WorkspaceTemplate config={config}/>;}\n`;
  files["template.config.json"] = JSON.stringify(options.config, null, 2);
  files["README.md"] =
    files["README.md"].replace("admin-cms", options.config.blueprint) +
    `\n## 선택한 내 구성\n\n템플릿: ${options.config.blueprint}\n화면 제목: ${options.config.title}\n선택한 메뉴·색상·밀도·표/카드·섹션 구성이 src/App.tsx와 template.config.json에 포함되어 있습니다. template.config.json은 구성 기록용이며 실행 시에는 src/App.tsx의 config를 사용합니다. src/Workspace.tsx는 공통 화면 구현, src/model.ts는 업무별 기본값과 Mock 데이터입니다.\n`;
  if (options.includeTests)
    files["src/workspace.test.ts"] =
      "import {test,expect} from 'vitest';\nimport {isTemplateConfig,defaultConfig} from './model';\ntest('selected template config is supported',()=>{expect(isTemplateConfig(defaultConfig('" +
      options.config.blueprint +
      "'))).toBe(true)});\n";
  const zip = new JSZip();
  for (const [path, value] of Object.entries(files))
    zip.file(`${options.name}/${path}`, value);
  return {
    files,
    bytes: await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
    }),
  };
}
