/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Slytherin Theme Colors
        slytherin: {
          50: '#f0f7f0',
          100: '#dbebdb',
          200: '#b8d8b8',
          300: '#8cbd8c',
          400: '#5a9d5a',
          500: '#1a5490', // Primary Slytherin blue
          600: '#134070',
          700: '#0f3259',
          800: '#0d2a4a',
          900: '#0a233d',
          950: '#051420',
        },
        slytherinGreen: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8ed08e',
          400: '#5cb25c',
          500: '#2d5016', // Primary Slytherin green
          600: '#254012',
          700: '#1f330f',
          800: '#1b2a0d',
          900: '#17240c',
          950: '#0c1206',
        },
        slytherinSilver: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1d20',
          950: '#0d0e10',
        },

        // Gryffindor Theme Colors
        gryffindor: {
          50: '#fff5f5',
          100: '#fed7d7',
          200: '#feb2b2',
          300: '#fc8181',
          400: '#f56565',
          500: '#740001', // Primary Gryffindor red
          600: '#63171b',
          700: '#521012',
          800: '#421a0f',
          900: '#351a0d',
          950: '#1a0c06',
        },
        gryffindorGold: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#eab308', // Primary Gryffindor gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },

        // Magical neutral colors
        magical: {
          dark: '#0f0f23',
          darker: '#050510',
          light: '#f8f9fa',
          paper: '#fdf6e3',
          parchment: '#f4f1e8',
          ink: '#2c3e50',
          quill: '#8b4513',
        },

        // Mystical accent colors
        mystical: {
          purple: '#6b46c1',
          ember: '#f59e0b',
          frost: '#06b6d4',
          shadow: '#374151',
          shimmer: '#fbbf24',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        philosopher: ['Philosopher', 'sans-serif'],
        uncial: ['Uncial Antiqua', 'cursive'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        flicker: 'flicker 2s ease-in-out infinite alternate',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        drift: 'drift 8s ease-in-out infinite',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.8)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(-5px) translateY(-20px)' },
          '75%': { transform: 'translateX(-10px) translateY(-5px)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
        },
      },
      backgroundImage: {
        'magical-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        parchment:
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgNjksIDEzLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')",
      },
      backdropBlur: {
        magical: '12px',
      },
      boxShadow: {
        magical:
          '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(251, 191, 36, 0.3)',
        'glow-lg': '0 0 40px rgba(251, 191, 36, 0.4)',
        ember: '0 0 30px rgba(245, 158, 11, 0.4)',
      },
    },
  },
  plugins: [],
};
