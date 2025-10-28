/**
 * Design System Tokens
 * Systematic design tokens for consistent styling across the application
 * Following 8px grid system and VSCode-inspired dark theme
 */

export const spacing = {
  // 8px grid system
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px - use sparingly
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px - use sparingly
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px - use sparingly
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
}

export const typography = {
  // Font families
  fontFamily: {
    sans: ['var(--font-geist-sans)', 'Segoe UI', 'system-ui', 'sans-serif'],
    mono: ['var(--font-geist-mono)', 'Consolas', 'Monaco', 'monospace'],
  },

  // Font sizes with responsive scaling
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],     // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],       // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],  // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.05em' }], // 36px
    '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.05em' }],   // 48px
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
}

export const colors = {
  // VSCode-inspired dark theme colors
  background: {
    primary: 'hsl(30, 2%, 12%)',      // #1E1E1E
    secondary: 'hsl(30, 2%, 14%)',    // #252526
    tertiary: 'hsl(30, 2%, 18%)',     // #2D2D30
    elevated: 'hsl(220, 8%, 23%)',    // #3E3E42
  },

  foreground: {
    primary: 'hsl(0, 0%, 80%)',       // #CCCCCC
    secondary: 'hsl(0, 0%, 62%)',     // #9D9D9D
    muted: 'hsl(0, 0%, 42%)',         // #6A6A6A
    subtle: 'hsl(0, 0%, 25%)',        // #404040
  },

  // Brand colors
  brand: {
    blue: {
      50: 'hsl(212, 100%, 97%)',
      100: 'hsl(212, 100%, 94%)',
      200: 'hsl(212, 100%, 87%)',
      300: 'hsl(212, 100%, 80%)',
      400: 'hsl(212, 100%, 67%)',
      500: 'hsl(207, 89%, 49%)',      // #007ACC
      600: 'hsl(207, 100%, 50%)',     // #0098FF
      700: 'hsl(207, 100%, 42%)',
      800: 'hsl(207, 100%, 35%)',
      900: 'hsl(207, 100%, 25%)',
    },
  },

  // Semantic colors
  semantic: {
    success: 'hsl(108, 56%, 67%)',    // #89D185
    warning: 'hsl(44, 71%, 65%)',     // #D7BA7D
    error: 'hsl(6, 86%, 68%)',        // #F48771
    info: 'hsl(199, 89%, 48%)',       // #007ACC
  },

  // Border colors
  border: {
    subtle: 'hsl(220, 8%, 23%)',      // #3E3E42
    default: 'hsl(220, 3%, 27%)',     // #454545
    strong: 'hsl(220, 8%, 35%)',      // #5A5A5A
    focus: 'hsl(207, 89%, 49%)',      // #007ACC
    success: 'hsl(108, 56%, 67%)',
    warning: 'hsl(44, 71%, 65%)',
    error: 'hsl(6, 86%, 68%)',
  },

  // Category colors for prompts
  category: {
    cloud: 'hsl(207, 72%, 66%)',      // #569CD6
    js: 'hsl(54, 95%, 64%)',          // #F9E64F
    bugs: 'hsl(6, 86%, 68%)',         // #F48771
    frontend: 'hsl(176, 43%, 54%)',   // #4EC9B0
    backend: 'hsl(296, 35%, 61%)',    // #C586C0
    plan: 'hsl(108, 56%, 67%)',       // #89D185
  },
}

export const shadows = {
  // VSCode-inspired shadows for dark theme
  sm: '0 1px 2px 0 hsl(0, 0%, 0% / 0.05)',
  default: '0 1px 3px 0 hsl(0, 0%, 0% / 0.1), 0 1px 2px -1px hsl(0, 0%, 0% / 0.1)',
  md: '0 4px 6px -1px hsl(0, 0%, 0% / 0.1), 0 2px 4px -2px hsl(0, 0%, 0% / 0.1)',
  lg: '0 10px 15px -3px hsl(0, 0%, 0% / 0.1), 0 4px 6px -4px hsl(0, 0%, 0% / 0.1)',
  xl: '0 20px 25px -5px hsl(0, 0%, 0% / 0.1), 0 8px 10px -6px hsl(0, 0%, 0% / 0.1)',
  inner: 'inset 0 2px 4px 0 hsl(0, 0%, 0% / 0.05)',
  glow: '0 0 20px hsl(207, 89%, 49% / 0.3)', // Blue glow for focus states
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px - VSCode style
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}

// Export design token object
export const designTokens = {
  spacing,
  typography,
  colors,
  shadows,
  borderRadius,
  zIndex,
  animation,
  breakpoints,
} as const

export default designTokens