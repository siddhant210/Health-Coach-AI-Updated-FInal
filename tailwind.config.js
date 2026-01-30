/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          from: '#3B82F6', // blue-500
          to: '#10B981', // emerald-500
        },
        background: {
          light: '#ffffff',
          dark: '#0f172a', // Slate-900 for better contrast
        },
        card: {
          light: '#ffffff',
          dark: '#1e293b', // Slate-800
        },
        surface: {
          dark: '#0f172a', // Slate-900
          darkAlt: '#1e293b', // Slate-800
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'dark-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};