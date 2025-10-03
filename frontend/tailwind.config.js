/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"New York"', 'ui-serif', 'Georgia'],
      },
      colors: {
        accent: {
          DEFAULT: '#7C4DFF',
          soft: '#A991FF',
        },
        neutral: {
          950: '#0A0A0A',
          900: '#111111',
          800: '#1F1F1F',
          700: '#2E2E2E',
          500: '#6B7280',
          300: '#D1D5DB',
          100: '#F5F6F8',
        },
      },
      boxShadow: {
        subtle: '0px 18px 44px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
