import type { Meta, StoryObj } from '@storybook/react';

import Loader from './Loader';

const meta = {
  title: 'Component/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 25,
    color: 'black',
  },
};
