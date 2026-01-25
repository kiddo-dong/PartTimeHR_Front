import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        hanna: ['var(--font-bm-hanna)'],
      },
    },
  },
  plugins: [],
};

export default config;
