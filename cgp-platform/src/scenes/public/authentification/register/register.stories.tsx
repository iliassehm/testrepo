import type { Meta,  StoryFn } from '@storybook/react';
import { RegisterPage } from './Register';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'Pages/RegisterPage',
  component: RegisterPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RegisterPage>;

const Template: StoryFn = (args) => <RegisterPage {...args} />

export const Default = Template.bind({});

Default.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);

  
    // Wait for the form to be rendered
        await canvas.findByTestId('name'); 

  await userEvent.type(canvas.getByTestId('name'), 'Doe');
  await userEvent.type(canvas.getByTestId('firstName'), 'John');
  await userEvent.type(canvas.getByTestId('companyName'), 'Acme Inc.');
  await userEvent.type(canvas.getByTestId('phone'), '06 01 02 03 04');
  await userEvent.type(canvas.getByTestId('email'), 'john@doe.com');

   // Check terms checkbox
   await userEvent.click(canvas.getByTestId('terms'));
   await userEvent.click(canvas.getByTestId('newsletterSubscriber'));

   // Wait until the button is enabled (when isValid becomes true)
   const subscribeButton = canvas.getByTestId('subscribe');
   await waitFor(() => {
     expect(subscribeButton).not.toHaveAttribute('disabled');
   });
 
   // Simulate form submission
   await userEvent.click(subscribeButton);
 
};
