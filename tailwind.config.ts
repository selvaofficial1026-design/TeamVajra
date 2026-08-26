/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          950: '#05070D',
          900: '#080B11',
          850: '#0D111D',
          800: '#121828',
          700: '#1A233A',
          600: '#253254',
          blue: '#2563EB',
          sky: '#38BDF8',
          cyan: '#06B6D4',
          amber: '#F59E0B',
        },
      },
      backgroundImage: {
        'radial-hero': 'radial-gradient(circle at 50% -10%, rgba(37, 99, 235, 0.22) 0%, rgba(6, 182, 212, 0.08) 35%, rgba(8, 11, 17, 0) 70%)',
        'subtle-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'aurora-mesh': 'radial-gradient(at 10% 20%, rgba(37, 99, 235, 0.15) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(6, 182, 212, 0.12) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(245, 158, 11, 0.06) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-blue': '0 0 35px -5px rgba(37, 99, 235, 0.4)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.4)',
        'glow-amber': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}