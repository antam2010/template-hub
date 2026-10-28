import { describe, it, expect } from "vitest";
import ts from "typescript";
import {
  defaults,
  designPresets,
  designCode,
  designStyle,
  type DesignConfig,
} from "../apps/showcase/src/design-model";
function diagnostics(c: DesignConfig) {
  return ts
    .transpileModule(designCode(c), {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: "SelectedDesign.tsx",
      reportDiagnostics: true,
    })
    .diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error);
}
describe("portable design snippets", () => {
  it.each(designPresets)("$id preset exports parseable React source", (p) =>
    expect(diagnostics(p.config)).toEqual([]),
  );
  it.each(["left", "right", "only"] as const)(
    "escapes labels for %s icon placement",
    (placement) =>
      expect(
        diagnostics({
          ...defaults,
          label: '<tag> {state} "quote"\n',
          placement,
          icon: "none",
          state: "loading",
        }),
      ).toEqual([]),
  );
  it("uses selected visual properties and keeps CSS variables portable", () => {
    const style = designStyle({
      ...defaults,
      tone: "blue",
      radius: "pill",
      size: "lg",
      fullWidth: true,
      state: "disabled",
    });
    expect(style.background).toContain("--design-blue");
    expect(style.borderRadius).toBe(999);
    expect(style.height).toBe(54);
    expect(style.width).toBe("100%");
    expect(style.opacity).toBe(0.45);
  });
});
