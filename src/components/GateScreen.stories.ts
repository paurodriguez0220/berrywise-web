import type { Meta, StoryObj } from '@storybook/react';
import { GateScreen } from './GateScreen';

const meta: Meta<typeof GateScreen> = {
  component: GateScreen,
  title: 'Components/GateScreen',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
};

export default meta;
type Story = StoryObj<typeof GateScreen>;

export const Default: Story = {};
