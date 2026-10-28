import { describe, it, expect } from "vitest";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import JSZip from "jszip";
import {
  generateProject,
  validateProjectName,
} from "../packages/project-generator/src/index";
import { templateIds } from "../packages/patterns/src/index";
const paths = [
  "packages/ui-core/src/index.tsx",
  "packages/ui-core/src/composites.tsx",
  "packages/ui-core/src/pattern-components.tsx",
  "packages/design-tokens/src/index.css",
  "packages/patterns/src/index.ts",
  ...templateIds.map((id) => `templates/${id}/src/App.tsx`),
];
const sources = Object.fromEntries(
  paths.map((p) => [p, readFileSync(p, "utf8")]),
);
describe("portable project generation", () => {
  it.each(["../escape", "UPPER", "a/b", "", "-test", "a".repeat(51), "con"])(
    "rejects unsafe name %s",
    (name) => expect(validateProjectName(name)).toBe(false),
  );
  it("rejects invalid template and missing sources", async () => {
    await expect(
      generateProject(
        {
          name: "valid",
          template: "unknown" as never,
          darkMode: false,
          includeTests: false,
        },
        sources,
      ),
    ).rejects.toThrow("지원하지");
    await expect(
      generateProject(
        {
          name: "valid",
          template: "admin-cms",
          darkMode: false,
          includeTests: false,
        },
        {},
      ),
    ).rejects.toThrow("소스 누락");
  });
  for (const template of templateIds) {
    for (const options of [true, false])
      it(`${template} with options=${options} emits real sources and independent config`, async () => {
        const name = `demo-${template}${options ? "" : "-minimal"}`;
        const result = await generateProject(
          { name, template, darkMode: options, includeTests: options },
          sources,
        );
        const zip = await JSZip.loadAsync(result.bytes);
        expect(await zip.file(`${name}/src/App.tsx`)!.async("string")).toBe(
          sources[`templates/${template}/src/App.tsx`],
        );
        const pkg = JSON.parse(
          await zip.file(`${name}/package.json`)!.async("string"),
        );
        expect(pkg.scripts.build).toContain("vite build");
        expect(JSON.stringify(pkg)).not.toContain("workspace:");
        expect(!!zip.file(`${name}/src/patterns.test.ts`)).toBe(options);
        expect(result.files["src/main.tsx"].includes("localStorage")).toBe(
          options,
        );
        expect(!!pkg.dependencies["@cloudscape-design/components"]).toBe(
          template === "cloud-console",
        );
        expect(!!zip.file(`${name}/src/ui-core/index.tsx`)).toBe(
          template !== "cloud-console",
        );
        mkdirSync(".generated", { recursive: true });
        writeFileSync(`.generated/${name}.zip`, result.bytes);
      });
  }
});
