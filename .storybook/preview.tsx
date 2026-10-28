import type { Preview } from "@storybook/react-vite";
import "../packages/design-tokens/src/index.css";
const preview: Preview = {
  parameters: { controls: { expanded: true }, a11y: { test: "error" } },
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: { icon: "circlehollow", items: ["light", "dark"] },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <div
        className={context.globals.theme === "dark" ? "dark" : ""}
        style={{ padding: 32, background: "var(--bg)", color: "var(--fg)" }}
      >
        <Story />
      </div>
    ),
  ],
};
export default preview;
