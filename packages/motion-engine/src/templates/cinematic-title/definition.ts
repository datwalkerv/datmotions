import type { TemplateDefinition } from '../schema'
import { CinematicTitleComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type CinematicTitleProps = {
  title: string
  subtitle: string
  eyebrow: string
  director: string
  backgroundColor: string
  letterboxColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  letterboxHeight: number
  animationStyle: 'classic' | 'modern' | 'fade'
  [key: string]: unknown
}

export const cinematicTitleDefinition: TemplateDefinition<CinematicTitleProps> = {
  id: 'cinematic-title',
  name: 'Cinematic Title Card',
  category: 'title',
  thumbnail: '/thumbnails/cinematic-title.jpg',
  fps: 60,
  defaultDurationInFrames: 240,
  supportedFormats: ['16:9'],
  defaultProps: {
    title: 'NEON DREAMS',
    subtitle: 'A Story of Light and Shadow',
    eyebrow: 'An Original Series',
    director: 'Directed by A. Director',
    backgroundColor: '#0D0D14',
    letterboxColor: '#000000',
    textColor: '#F4F4F5',
    accentColor: '#39FF88',
    fontFamily: 'bebas',
    letterboxHeight: 14,
    animationStyle: 'classic',
  },
  schema: [
    { key: 'title', label: 'Title', group: 'Content', control: 'text', default: 'NEON DREAMS' },
    { key: 'subtitle', label: 'Subtitle', group: 'Content', control: 'text', default: 'A Story of Light and Shadow' },
    { key: 'eyebrow', label: 'Eyebrow', group: 'Content', control: 'text', default: 'An Original Series' },
    { key: 'director', label: 'Credit Line', group: 'Content', control: 'text', default: 'Directed by A. Director' },
    { key: 'animationStyle', label: 'Animation', group: 'Animation', control: 'select', default: 'classic', options: [
      { value: 'classic', label: 'Classic (bars slide)' },
      { value: 'modern', label: 'Modern (zoom + fade)' },
      { value: 'fade', label: 'Fade In' },
    ]},
    { key: 'letterboxHeight', label: 'Letterbox Height %', group: 'Layout', control: 'slider', default: 14, min: 0, max: 25, step: 1 },
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'bebas', options: FONT_OPTIONS },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF88' },
    { key: 'textColor', label: 'Text Color', group: 'Color', control: 'color', default: '#F4F4F5' },
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0D0D14' },
    { key: 'letterboxColor', label: 'Letterbox Color', group: 'Color', control: 'color', default: '#000000' },
  ],
  component: CinematicTitleComposition,
}
