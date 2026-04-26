import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#f7f6f3',
        slateInk: '#1f2630',
        mutedInk: '#5f6670',
        line: '#d9d8d4',
        accent: '#1c2c44',
      },
      fontFamily: {
        editorial: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', '"Times New Roman"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        premium: '0.015em',
      },
      boxShadow: {
        whisper: '0 6px 24px rgba(15, 26, 42, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
