import { createRoot } from "react-dom/client";
import WorkspaceTemplate from "./App";
import { blueprintFor, defaultConfig, isTemplateConfig } from "./model";
import "../../../packages/design-tokens/src/index.css";
const params = new URLSearchParams(location.search);
let config = defaultConfig(blueprintFor(params.get("template")).id);
try {
  const parsed = JSON.parse(params.get("config") ?? "null");
  if (isTemplateConfig(parsed)) config = parsed;
} catch {
  /* malformed optional preview config uses template defaults */
}
document.documentElement.classList.toggle(
  "dark",
  params.get("theme") === "dark",
);
createRoot(document.getElementById("root")!).render(
  <WorkspaceTemplate config={config} />,
);
