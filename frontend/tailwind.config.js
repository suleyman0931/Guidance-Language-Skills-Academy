/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8ecf5',
          100: '#c5ceea',
          200: '#9aadd8',
          300: '#6f8cc6',
          400: '#4e72b9',
          500: '#2d58ac',
          600: '#1e3d8f',
          700: '#162e72',
          800: '#0d1b4b',
          900: '#090f2a',
        },
        gold: {
          50: '#fdf8ec',
          100: '#f9edcc',
          200: '#f4de9a',
          300: '#f0d068',
          400: '#e8bb36',
          500: '#c4a84f',
          600: '#a08a3a',
          700: '#7c6b25',
          800: '#584c10',
          900: '#342d00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
