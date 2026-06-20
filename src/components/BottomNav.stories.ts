import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { BottomNav } from './BottomNav';

const meta: Meta<typeof BottomNav> = {
  component: BottomNav,
  title: 'Components/BottomNav',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
  args: {
    onTabChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Members: Story = {
  args: { activeTab: 'members' },
};

export const Expenses: Story = {
  args: { activeTab: 'expenses' },
};

export const Balances: Story = {
  args: { activeTab: 'balances' },
};

export const Settle: Story = {
  args: { activeTab: 'settle' },
};
