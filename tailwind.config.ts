import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#008080',
          '50': '#E0F2F1',
          '100': '#B2DFDB',
          '200': '#80CBC4',
          '300': '#4DB6AC',
          '400': '#26A69A',
          '500': '#009688',
          '600': '#00897B',
          '700': '#00796B',
        },
        secondary: {
          DEFAULT: '#606060',
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
        },
      },
    },
  },
} satisfies Config;
