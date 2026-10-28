import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/noto-sans-kr";
document.body.style.fontFamily = '"Noto Sans KR Variable", sans-serif';
import "@cloudscape-design/global-styles/index.css";
import { applyMode, Mode } from "@cloudscape-design/global-styles";
applyMode(
  new URLSearchParams(location.search).get("theme") === "dark"
    ? Mode.Dark
    : Mode.Light,
);
createRoot(document.getElementById("root")!).render(<App />);
