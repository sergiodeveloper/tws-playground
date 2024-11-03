import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';

import Footer from './Footer';

const meta = {
  title: 'View/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  // tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'value1' },
      { label: 'Option 2', value: 'value2' },
    ],
    initial: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const footer = canvas.getByRole('footer') as HTMLDivElement;

    await expect(footer).toBeInTheDocument();

    // Check if footer has a size
    const boundingBox = footer.getBoundingClientRect();

    await expect(boundingBox.width).toBeGreaterThan(0);
    await expect(boundingBox.height).toBeGreaterThan(0);

    // Check if footer has a background color
    const styles = getComputedStyle(footer);

    await expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(styles.backgroundColor).not.toBe('transparent');
    await expect(styles.backgroundColor).not.toBe('');
    await expect(styles.backgroundColor).not.toBe(null);
    await expect(styles.backgroundColor).not.toBe(undefined);
  }
};
