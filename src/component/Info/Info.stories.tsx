import type { Meta, StoryObj } from '@storybook/react';

import Info from './Info';

const meta = {
  title: 'Component/Info',
  component: Info,
  parameters: {
    // layout: 'centered',
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof Info>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'This is a test info message with a long text to test the overflow behavior.',
  },
};

export const TouchingTheRightEdge: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '50px', height: '100vh' }}>
         <div style={{ position: 'relative', right: 0 }}>
           <Story />
         </div>
      </div>
    ),
  ],
  args: {
    text: 'Test info message to test the mirroring behavior.',
  },
};
