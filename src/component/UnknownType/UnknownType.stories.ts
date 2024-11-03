import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, screen } from '@storybook/test';

import UnknownType from './UnknownType';

const meta = {
  title: 'Component/UnknownType',
  component: UnknownType,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof UnknownType>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    definition: '{\n  "type": "test"\n}',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const label = canvas.getByText('Unknown type:');

    await expect(label).toBeInTheDocument();

    const unknown = screen.getByRole('type-definition');

    await expect(unknown).toBeInTheDocument();

    await expect(unknown).toHaveTextContent('"type": "test"');
  }
};
