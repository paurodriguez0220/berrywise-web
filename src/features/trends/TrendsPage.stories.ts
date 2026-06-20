import type { Meta, StoryObj } from '@storybook/react';
import { TrendsPage } from './TrendsPage';

const meta: Meta<typeof TrendsPage> = {
  component: TrendsPage,
  title: 'Features/TrendsPage',
  parameters: {
    viewport: { defaultViewport: 'iphone15' },
  },
};

export default meta;
type Story = StoryObj<typeof TrendsPage>;

export const WithData: Story = {};

export const Empty: Story = {};

export const SingleMonth: Story = {};
