import type { TemplateDefinition } from '../schema'
import { KineticTypographyComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type KineticTypographyProps = {
  phrase: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  fontWeight: number
  fontSize: number
  staggerDelay: number
  animationStyle: 'scale-fade' | 'slide-blur' | 'pop'
  [key: string]: unknown
}

export const kineticTypographyDefinition: TemplateDefinition<KineticTypographyProps> = {
  id: 'kinetic-typography',
  name: 'Kinetic Typography',
  category: 'kinetic',
  thumbnail: '/thumbnails/kinetic-typography.jpg',
  fps: 60,
  defaultDurationInFrames: 240,
  supportedFormats: ['16:9', '9:16', '1:1'],
  defaultProps: {
    phrase: 'Move fast. Think deep. Ship great.',
    backgroundColor: '#0A0A0B',
    textColor: '#FFFFFF',
    accentColor: '#39FF88',
    fontFamily: 'sf-pro-display',
    fontWeight: 700,
    fontSize: 1.0,
    staggerDelay: 8,
    animationStyle: 'scale-fade',
  },
  schema: [
    { key: 'phrase', label: 'Phrase', group: 'Content', control: 'textarea', default: 'Move fast. Think deep. Ship great.' },
    { key: 'animationStyle', label: 'Animation Style', group: 'Animation', control: 'select', default: 'scale-fade', options: [
      { value: 'scale-fade', label: 'Scale Fade' },
      { value: 'slide-blur', label: 'Slide Blur' },
      { value: 'pop', label: 'Pop' },
    ]},
    { key: 'staggerDelay', label: 'Word Stagger (frames)', group: 'Animation', control: 'slider', default: 8, min: 2, max: 20, step: 1 },
    { key: 'fontSize', label: 'Font Scale', group: 'Typography', control: 'slider', default: 1.0, min: 0.5, max: 2.0, step: 0.05 },
    { key: 'fontWeight', label: 'Font Weight', group: 'Typography', control: 'slider', default: 700, min: 400, max: 900, step: 100 },
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'sf-pro-display', options: [
      { value: 'sf-pro-display', label: 'SF Pro Display' },
      { value: 'neue-haas-display', label: 'Neue Haas Display' },
      ...FONT_OPTIONS,
    ]},
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
    { key: 'textColor', label: 'Text Color', group: 'Color', control: 'color', default: '#FFFFFF' },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF88' },
  ],
  component: KineticTypographyComposition,
}
