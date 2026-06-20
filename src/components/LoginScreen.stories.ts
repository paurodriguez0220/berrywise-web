import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { LoginScreen } from './LoginScreen';

const meta: Meta<typeof LoginScreen> = {
  component: LoginScreen,
  title: 'Components/LoginScreen',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
  args: {
    onLogin: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LoginScreen>;

export const Default: Story = {};

export const WrongPin: Story = {
  args: {
    onLogin: () => false,
  },
};
