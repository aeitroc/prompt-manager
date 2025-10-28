import type { Config } from 'tailwindcss'
import { designTokens } from './src/lib/design-tokens'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Keep existing VSCode colors for backward compatibility
        vscode: {
          blue: '#007ACC',
          'blue-light': '#0098FF',
          green: '#89D185',
          yellow: '#D7BA7D',
          red: '#F48771',
        },
        // Enhanced background colors
        bg: {
          primary: '#1E1E1E',
          secondary: '#252526',
          tertiary: '#2D2D30',
          elevated: '#3E3E42',
        },
        // Enhanced text colors
        txt: {
          primary: '#CCCCCC',
          secondary: '#9D9D9D',
          muted: '#6A6A6A',
          subtle: '#404040',
        },
        // Enhanced border colors
        bdr: {
          subtle: '#3E3E42',
          default: '#454545',
          strong: '#5A5A5A',
          focus: '#007ACC',
          success: '#89D185',
          warning: '#D7BA7D',
          error: '#F48771',
        },
        // Category colors
        category: {
          cloud: '#569CD6',
          js: '#F9E64F',
          bugs: '#F48771',
          frontend: '#4EC9B0',
          backend: '#C586C0',
          plan: '#89D185',
        },
        // New semantic colors
        semantic: {
          success: '#89D185',
          warning: '#D7BA7D',
          error: '#F48771',
          info: '#007ACC',
        },
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'Consolas', 'Monaco', 'monospace'],
        sans: ['var(--font-geist-sans)', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      // Systematic spacing using 8px grid
      spacing: {
        ...designTokens.spacing,
      },
      // Enhanced typography
      fontSize: {
        ...designTokens.typography.fontSize,
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      lineHeight: {
        ...designTokens.typography.lineHeight,
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      // Enhanced shadows
      boxShadow: {
        ...designTokens.shadows,
      },
      // Enhanced border radius
      borderRadius: {
        ...designTokens.borderRadius,
      },
      // Enhanced z-index scale
      zIndex: {
        ...designTokens.zIndex,
      },
      // Animation duration and easing
      transitionDuration: {
        ...designTokens.animation.duration,
      },
      transitionTimingFunction: {
        ...designTokens.animation.easing,
      },
      // Custom utilities for better UX
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-in': 'slideIn 200ms ease-out',
        'slide-out': 'slideOut 200ms ease-in',
        'scale-in': 'scaleIn 150ms ease-out',
        'scale-out': 'scaleOut 150ms ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
