import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { AddExpenseModal } from './AddExpenseModal';

const twoMembers = [
  { id: 1, name: 'Paulo' },
  { id: 2, name: 'Gene' },
];

const threeMembers = [
  { id: 1, name: 'Paulo' },
  { id: 2, name: 'Gene' },
  { id: 3, name: 'Maria' },
];

const meta: Meta<typeof AddExpenseModal> = {
  component: AddExpenseModal,
  title: 'Features/AddExpenseModal',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
  args: {
    members: twoMembers,
    onSave: fn(),
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AddExpenseModal>;

export const Default: Story = {};

export const ThreeMembers: Story = {
  args: { members: threeMembers },
};

export const SingleMember: Story = {
  args: { members: [{ id: 1, name: 'Paulo' }] },
};
