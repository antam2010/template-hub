import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: [
    "../packages/ui-core/src/**/*.stories.tsx",
    "../apps/showcase/src/**/*.stories.tsx",
  ],
  addons: ["@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
};
export default config;
