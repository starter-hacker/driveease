// FILE: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A09',
          2: '#111110',
          3: '#1A1918',
          4: '#242320',
          5: '#2E2C29',
        },
        stone: {
          DEFAULT: '#F8F7F4',
          2: '#F0EEE9',
          3: '#E8E5DF',
          4: '#D4D0C8',
          5: '#B0ABA0',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E8C98A',
          dark: '#A8863E',
          muted: 'rgba(201,169,110,0.15)',
        },
        status: {
          green: '#6FCF97',
          blue: '#4A7FD4',
          amber: '#F2C94C',
          red: '#EB5757',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { letterSpacing: '0.12em', lineHeight: '1.4' }],
        xs: ['11px', { letterSpacing: '0.08em', lineHeight: '1.5' }],
        sm: ['13px', { letterSpacing: '0.01em', lineHeight: '1.6' }],
        base: ['15px', { letterSpacing: '0', lineHeight: '1.7' }],
        lg: ['17px', { letterSpacing: '-0.01em', lineHeight: '1.5' }],
        xl: ['22px', { letterSpacing: '-0.015em', lineHeight: '1.3' }],
        '2xl': ['28px', { letterSpacing: '-0.02em', lineHeight: '1.2' }],
        '3xl': ['36px', { letterSpacing: '-0.02em', lineHeight: '1.1' }],
        '4xl': ['48px', { letterSpacing: '-0.025em', lineHeight: '1.05' }],
        '5xl': ['60px', { letterSpacing: '-0.03em', lineHeight: '1.0' }],
        display: ['72px', { letterSpacing: '-0.03em', lineHeight: '0.95' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        46: '11.5rem',
        50: '12.5rem',
        sidebar: '220px',
      },
      borderColor: {
        hairline: 'rgba(255,255,255,0.06)',
        subtle: 'rgba(255,255,255,0.10)',
        moderate: 'rgba(255,255,255,0.18)',
        gold: 'rgba(201,169,110,0.30)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        fadeIn: 'fadeIn 0.3s ease-out both',
        slideRight: 'slideRight 0.35s ease-out both',
        slideLeft: 'slideLeft 0.35s cubic-bezier(0.32,0,0.67,0) both',
        shimmer: 'shimmer 2s linear infinite',
        scaleIn: 'scaleIn 0.2s ease-out both',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,169,110,0.4)',
        'gold-lg': '0 0 24px rgba(201,169,110,0.12)',
        panel: '0 8px 48px rgba(0,0,0,0.4)',
        overlay: '0 16px 64px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
