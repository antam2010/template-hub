import { createRoot } from "react-dom/client";
import App from "./App";
import "../../../packages/design-tokens/src/index.css";
document.documentElement.classList.toggle(
  "dark",
  new URLSearchParams(location.search).get("theme") === "dark",
);
createRoot(document.getElementById("root")!).render(<App />);
