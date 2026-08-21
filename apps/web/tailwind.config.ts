import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0A0A0B',
          subtle: '#111113',
          raised: '#18181B',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.14)',
        },
        accent: {
          DEFAULT: '#39FF88',
          dim: 'rgba(57,255,136,0.12)',
          glow: 'rgba(57,255,136,0.3)',
        },
        text: {
          primary: '#F4F4F5',
          secondary: 'rgba(244,244,245,0.65)',
          muted: 'rgba(244,244,245,0.38)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grid-subtle': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [],
}

export default config
