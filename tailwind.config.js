/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#ece9e1',
          200: '#d9d2c5',
          300: '#bfb5a2',
          400: '#a39479',
          500: '#8f7d62',
          600: '#7a6852',
          700: '#655546',
          800: '#53463c',
          900: '#463c35',
          950: '#261f1a',
        },
        paper: '#faf9f6',
        parchment: '#f0ede6',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#261f1a',
            a: {
              color: '#7a6852',
              '&:hover': { color: '#53453c' },
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
