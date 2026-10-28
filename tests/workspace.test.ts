import { describe, it, expect } from "vitest";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import JSZip from "jszip";
import {
  blueprints,
  defaultConfig,
  isTemplateConfig,
  applyComposition,
  stylePresets,
} from "../templates/workspace/src/model";
import { generateWorkspaceProject } from "../packages/project-generator/src/workspace";
const paths = [
  "packages/ui-core/src/index.tsx",
  "packages/ui-core/src/composites.tsx",
  "packages/ui-core/src/pattern-components.tsx",
  "packages/design-tokens/src/index.css",
  "packages/patterns/src/index.ts",
  "templates/admin-cms/src/App.tsx",
  "templates/workspace/src/App.tsx",
  "templates/workspace/src/model.ts",
  "templates/workspace/src/workspace.css",
];
const sources = Object.fromEntries(
  paths.map((path) => [path, readFileSync(path, "utf8")]),
);
describe("complete templates and one-click compositions", () => {
  it("has 12 unique meaningful screen definitions with consistent rows", () => {
    expect(blueprints).toHaveLength(12);
    expect(new Set(blueprints.map((b) => b.id)).size).toBe(12);
    for (const b of blueprints) {
      expect(isTemplateConfig(defaultConfig(b.id))).toBe(true);
      for (const row of b.rows) {
        expect(row.cells).toHaveLength(b.columns.length);
        expect(b.statuses).toContain(row.status);
      }
    }
  });
  it.each(stylePresets)(
    "$id changes appearance and preserves selected business screen",
    (preset) => {
      const current = {
        ...defaultConfig("members"),
        title: "우리 회원 관리",
        brand: "Team",
      };
      const next = applyComposition(current, preset.patch);
      expect(next.blueprint).toBe("members");
      expect(next.title).toBe(current.title);
      expect(next.brand).toBe("Team");
      expect(isTemplateConfig(next)).toBe(true);
    },
  );
  it("applies a user-saved composition across business templates without replacing their purpose", () => {
    const next = applyComposition(defaultConfig("orders"), {
      ...defaultConfig("crm"),
      navigation: "topbar",
      display: "cards",
      accent: "green",
      brand: "Other",
    });
    expect(next.blueprint).toBe("orders");
    expect(next.title).toBe("주문·결제 관리");
    expect(next.brand).toBe("Workspace");
    expect(next.navigation).toBe("topbar");
    expect(next.display).toBe("cards");
  });
  it.each([
    null,
    {},
    { ...defaultConfig("content"), navigation: "script" },
    { ...defaultConfig("members"), metrics: "yes" },
    { ...defaultConfig("orders"), title: "a".repeat(81) },
  ])("rejects invalid preview config", (value) =>
    expect(isTemplateConfig(value)).toBe(false),
  );
  for (const b of blueprints)
    it(`exports ${b.id} with selected settings and real reusable screen code`, async () => {
      const config = applyComposition(
        { ...defaultConfig(b.id), title: `${b.name} 맞춤` },
        stylePresets[b.id.length % stylePresets.length].patch,
      );
      const name = `demo-workspace-${b.id}`;
      const result = await generateWorkspaceProject(
        { name, config, darkMode: true, includeTests: true },
        sources,
      );
      const zip = await JSZip.loadAsync(result.bytes);
      expect(
        JSON.parse(
          await zip.file(`${name}/template.config.json`)!.async("string"),
        ),
      ).toEqual(config);
      expect(await zip.file(`${name}/src/Workspace.tsx`)!.async("string")).toBe(
        sources["templates/workspace/src/App.tsx"],
      );
      expect(result.files["src/App.tsx"]).toContain(
        JSON.stringify(config, null, 2),
      );
      expect(result.files["README.md"]).toContain("선택한 내 구성");
      expect(
        JSON.parse(result.files["package.json"]).dependencies[
          "@cloudscape-design/components"
        ],
      ).toBeUndefined();
      mkdirSync(".generated", { recursive: true });
      writeFileSync(`.generated/${name}.zip`, result.bytes);
    });
});
