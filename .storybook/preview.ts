import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone15',
      viewports: {
        iphone15: {
          name: 'iPhone 15',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        iphone15pro: {
          name: 'iPhone 15 Pro Max',
          styles: { width: '430px', height: '932px' },
          type: 'mobile',
        },
      },
    },
  },
};

export default preview;
