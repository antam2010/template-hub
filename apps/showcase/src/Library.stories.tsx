import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentDemo from "./ComponentDemo";
import { componentNames } from "../../../packages/patterns/src/index";
const meta = {
  title: "Library/Interactive",
  component: ComponentDemo,
  args: {
    name: "Input",
    label: "예시 컴포넌트",
    variant: "default",
    size: "default",
    disabled: false,
    loading: false,
  },
  argTypes: { name: { control: "select", options: componentNames } },
} satisfies Meta<typeof ComponentDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Controls: Story = {};
export const Form: Story = { args: { name: "Form" } };
export const Modal: Story = { args: { name: "Modal" } };
export const Tabs: Story = { args: { name: "Tabs" } };
export const FileUpload: Story = { args: { name: "FileUpload" } };
