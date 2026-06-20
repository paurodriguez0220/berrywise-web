import type { Meta, StoryObj } from '@storybook/react';
import { BalancesPage } from './BalancesPage';

const meta: Meta<typeof BalancesPage> = {
  component: BalancesPage,
  title: 'Features/BalancesPage',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
};

export default meta;
type Story = StoryObj<typeof BalancesPage>;

export const Default: Story = {};
