import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./index";
const meta = {
  title: "Core/Button",
  component: Button,
  args: { children: "프로젝트 생성" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "destructive"],
    },
    size: { control: "select", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
