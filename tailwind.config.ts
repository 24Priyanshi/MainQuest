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
        base: {
          DEFAULT: '#1A1425',
          panel: '#2B1E36',
          card: '#352642',
          border: '#A25E83',
        },
        accent: {
          primary: '#A7C99A',
          secondary: '#F274D5',
          warning: '#F4A261',
          danger: '#F05E41',
        },
        text: {
          primary: '#FFF3F4',
          secondary: '#D8BFD0',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(88, 129, 87, 0.3), 0 0 20px rgba(88, 129, 87, 0.1)',
        'neon-purple': '0 0 10px rgba(224, 122, 95, 0.3), 0 0 20px rgba(224, 122, 95, 0.1)',
        'neon-green-lg': '0 0 15px rgba(88, 129, 87, 0.4), 0 0 30px rgba(88, 129, 87, 0.2)',
        'neon-purple-lg': '0 0 15px rgba(224, 122, 95, 0.4), 0 0 30px rgba(224, 122, 95, 0.2)',
        pixel: '4px 4px 0px #2B1D12',
      },
      keyframes: {
        'xp-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.2)', filter: 'brightness(2)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'flame': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
          '25%': { transform: 'scaleY(1.1) scaleX(0.95)' },
          '50%': { transform: 'scaleY(0.95) scaleX(1.05)' },
          '75%': { transform: 'scaleY(1.05) scaleX(0.98)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'xp-fill': 'xp-fill 1s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'level-up': 'level-up 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'flame': 'flame 0.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
