import { Meta, StoryFn } from "@storybook/react";

import { CompanyHome } from "./home";

export default {
  title: "Pages/CompanyHome",
  component: CompanyHome,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CompanyHome>;

const Template: StoryFn = (args) => <CompanyHome {...args} />;

export const Default = Template.bind({});
