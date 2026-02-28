/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5e6ff',
          100: '#e8c5ff',
          200: '#d18bff',
          300: '#b852ff',
          400: '#9d1fff',
          500: '#7c00d4',
          600: '#5c009e',
          700: '#3D005E',
          800: '#2a0042',
          900: '#180026',
          950: '#0d0015',
        },
        gold: {
          300: '#ffe09a',
          400: '#FFD680',
          500: '#f5c842',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1)',
        glow: '0 0 20px rgba(61,0,94,0.25)',
      },
    },
  },
  plugins: [],
};
