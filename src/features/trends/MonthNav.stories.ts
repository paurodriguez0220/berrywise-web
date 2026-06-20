import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { MonthNav } from './MonthNav';

const meta: Meta<typeof MonthNav> = {
  component: MonthNav,
  title: 'Features/MonthNav',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
  args: {
    onPrev: fn(),
    onNext: fn(),
    onToggleAll: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MonthNav>;

export const AllTimeMode: Story = {
  args: { year: 2026, month: 5, mode: 'all' },
};

export const MonthMode: Story = {
  args: { year: 2026, month: 5, mode: 'month' },
};

export const CurrentMonth: Story = {
  args: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    mode: 'month',
  },
};
