import { describe, it, expect } from "vitest";
// @ts-expect-error standalone ESM CLI also exports its pure AST audit function
import { auditSource, checkProject } from "../scripts/check-ui-policy.mjs";
import policy from "../examples/company-members/ui-policy.json";
import registry from "../registry/components.json";
import { readFileSync } from "node:fs";
import ts from "typescript";
describe("company UI policy", () => {
  it("checks the entire formatted consumer including bootstrap", async () =>
    expect(
      await checkProject(process.cwd() + "/examples/company-members"),
    ).toEqual([]));
  it("accepts the actual member composition", () => {
    expect(
      auditSource(
        readFileSync("examples/company-members/src/App.tsx", "utf8"),
        policy,
      ),
    ).toEqual([]);
  });
  it.each([
    [
      "native controls",
      "export default function App(){return <button>new</button>}",
    ],
    [
      "new library",
      "import {Button} from 'other-ui';export default function App(){return <Button/>}",
    ],
    [
      "inline styles",
      "import {Button} from '@hub/ui-core';const x=<Button style={{color:'red'}}/>",
    ],
    [
      "utility overrides",
      "import {Input} from '@hub/ui-core';const x=<Input className='p-9'/>",
    ],
    [
      "local imitation",
      "function MyButton(){return <span/>};const x=<MyButton/>",
    ],
    [
      "namespace bypass",
      "import * as UI from '@hub/ui-core';const x=<UI.Button/>",
    ],
    [
      "dynamic creation",
      "import React from 'react';const x=React.createElement('button')",
    ],
    ["dynamic import", "const x=import('other-ui')"],
    [
      "unknown export",
      "import {FancyButton} from '@hub/ui-core';const x=<FancyButton/>",
    ],
    [
      "hidden attributes",
      "import {Button} from '@hub/ui-core';const x=<Button {...props}/>",
    ],
    ["DOM injection", "document.body.innerHTML='<button/>'"],
  ])("rejects %s", (_, source) =>
    expect(auditSource(source, policy).length).toBeGreaterThan(0),
  );
  it("allows approved named aliases", () =>
    expect(
      auditSource(
        "import {Button as Action} from '@hub/ui-core';const x=<Action/>",
        policy,
      ),
    ).toEqual([]));
  it("keeps registry names unique and tied to exported declarations", () => {
    expect(new Set(registry.components.map((c) => c.id)).size).toBe(
      registry.components.length,
    );
    for (const c of registry.components) {
      const source = ts.createSourceFile(
        c.source,
        readFileSync(c.source, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      expect(
        source.statements.some(
          (s) =>
            ts.isFunctionDeclaration(s) &&
            s.name?.text === c.id &&
            s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword),
        ),
      ).toBe(true);
    }
  });
});
