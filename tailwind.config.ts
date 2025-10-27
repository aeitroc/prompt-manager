import type { Config } from 'tailwindcss'

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
        // VSCode brand colors
        vscode: {
          blue: '#007ACC',
          'blue-light': '#0098FF',
          green: '#89D185',
          yellow: '#D7BA7D',
          red: '#F48771',
        },
        // Background colors
        bg: {
          primary: '#1E1E1E',
          secondary: '#252526',
          tertiary: '#2D2D30',
          elevated: '#3E3E42',
        },
        // Text colors
        txt: {
          primary: '#CCCCCC',
          secondary: '#9D9D9D',
          muted: '#6A6A6A',
        },
        // Border colors
        bdr: {
          subtle: '#3E3E42',
          default: '#454545',
          focus: '#007ACC',
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
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'Consolas', 'Monaco', 'monospace'],
        sans: ['var(--font-geist-sans)', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
