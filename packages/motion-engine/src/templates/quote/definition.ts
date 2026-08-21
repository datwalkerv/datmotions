import type { TemplateDefinition } from '../schema'
import { QuoteComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type QuoteProps = {
  quote: string
  attribution: string
  backgroundColor: string
  quoteColor: string
  attributionColor: string
  accentColor: string
  fontFamily: string
  animationStyle: 'mask-reveal' | 'fade-up' | 'blur-in'
  [key: string]: unknown
}

export const quoteDefinition: TemplateDefinition<QuoteProps> = {
  id: 'quote',
  name: 'Animated Quote',
  category: 'quote',
  thumbnail: '/thumbnails/quote.jpg',
  fps: 60,
  defaultDurationInFrames: 240,
  supportedFormats: ['16:9', '1:1'],
  defaultProps: {
    quote: '"The details are not the details. They make the design."',
    attribution: '— Charles Eames',
    backgroundColor: '#0A0A0B',
    quoteColor: '#F4F4F5',
    attributionColor: 'rgba(244,244,245,0.55)',
    accentColor: '#39FF88',
    fontFamily: 'fraunces',
    animationStyle: 'mask-reveal',
  },
  schema: [
    { key: 'quote', label: 'Quote Text', group: 'Content', control: 'textarea', default: '"The details are not the details. They make the design."' },
    { key: 'attribution', label: 'Attribution', group: 'Content', control: 'text', default: '— Charles Eames' },
    { key: 'animationStyle', label: 'Animation Style', group: 'Animation', control: 'select', default: 'mask-reveal', options: [
      { value: 'mask-reveal', label: 'Mask Reveal' },
      { value: 'fade-up', label: 'Fade Up' },
      { value: 'blur-in', label: 'Blur In' },
    ]},
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'fraunces', options: [
      { value: 'fraunces', label: 'Fraunces' },
      { value: 'sf-pro-display', label: 'SF Pro Display' },
      ...FONT_OPTIONS,
    ]},
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
    { key: 'quoteColor', label: 'Quote Color', group: 'Color', control: 'color', default: '#F4F4F5' },
    { key: 'attributionColor', label: 'Attribution Color', group: 'Color', control: 'color', default: 'rgba(244,244,245,0.55)' },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF88' },
  ],
  component: QuoteComposition,
}
