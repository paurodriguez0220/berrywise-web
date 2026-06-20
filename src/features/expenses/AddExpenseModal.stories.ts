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

export const EditMode: Story = {
  args: {
    initialValues: {
      id: 1,
      description: 'Dinner at Jollibee',
      amount: 850,
      paidBy: 1,
      splits: [
        { memberId: 1, share: 425 },
        { memberId: 2, share: 425 },
      ],
    },
    onDelete: fn(),
  },
};

export const CustomSplit: Story = {
  args: {
    members: threeMembers,
    initialValues: {
      id: 2,
      description: 'Grocery run',
      amount: 1200,
      paidBy: 2,
      splits: [
        { memberId: 1, share: 600 },
        { memberId: 2, share: 400 },
        { memberId: 3, share: 200 },
      ],
    },
    onDelete: fn(),
  },
};

export const ConfirmDelete: Story = {
  args: {
    initialValues: {
      id: 3,
      description: 'Coffee',
      amount: 180,
      paidBy: 1,
      splits: [
        { memberId: 1, share: 90 },
        { memberId: 2, share: 90 },
      ],
    },
    onDelete: fn(),
  },
  play: async ({ canvas }) => {
    const { getByText } = await import('@testing-library/dom');
    getByText(canvas, 'Delete expense').click();
  },
};

export const ValidationError: Story = {
  args: {
    initialValues: {
      id: 4,
      description: 'Team lunch',
      amount: 500,
      paidBy: 1,
      splits: [
        { memberId: 1, share: 100 },
        { memberId: 2, share: 100 },
      ],
    },
    onDelete: fn(),
    onSave: fn().mockRejectedValue(new Error('Network error — check your connection')),
  },
};
