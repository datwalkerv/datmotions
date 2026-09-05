import type { TemplateDefinition } from '../schema'
import { TitleRevealComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type TitleRevealProps = {
  headline: string
  subline: string
  backgroundColor: string
  headlineColor: string
  sublineColor: string
  accentColor: string
  fontFamily: string
  animationStyle: 'blur-rise' | 'slide-up' | 'fade'
  holdDuration: number
  [key: string]: unknown
}

export const titleRevealDefinition: TemplateDefinition<TitleRevealProps> = {
  id: 'title-reveal',
  name: 'Apple-style Title Reveal',
  category: 'title',
  thumbnail: '/thumbnails/title-reveal.jpg',
  fps: 60,
  defaultDurationInFrames: 180,
  supportedFormats: ['16:9', '9:16', '1:1'],
  defaultProps: {
    headline: 'Introducing.',
    subline: 'The future of motion.',
    backgroundColor: '#0A0A0B',
    headlineColor: '#FFFFFF',
    sublineColor: 'rgba(255,255,255,0.6)',
    accentColor: '#39FF14',
    fontFamily: 'sf-pro-display',
    animationStyle: 'blur-rise',
    holdDuration: 60,
  },
  schema: [
    {
      key: 'headline',
      label: 'Headline',
      group: 'Content',
      control: 'text',
      default: 'Introducing.',
    },
    {
      key: 'subline',
      label: 'Subline',
      group: 'Content',
      control: 'text',
      default: 'The future of motion.',
    },
    {
      key: 'animationStyle',
      label: 'Animation Style',
      group: 'Animation',
      control: 'select',
      default: 'blur-rise',
      options: [
        { value: 'blur-rise', label: 'Blur Rise' },
        { value: 'slide-up', label: 'Slide Up' },
        { value: 'fade', label: 'Fade' },
      ],
    },
    {
      key: 'holdDuration',
      label: 'Hold (frames)',
      group: 'Animation',
      control: 'slider',
      default: 60,
      min: 0,
      max: 120,
      step: 1,
    },
    {
      key: 'backgroundColor',
      label: 'Background',
      group: 'Color',
      control: 'color',
      default: '#0A0A0B',
    },
    {
      key: 'headlineColor',
      label: 'Headline Color',
      group: 'Color',
      control: 'color',
      default: '#FFFFFF',
    },
    {
      key: 'sublineColor',
      label: 'Subline Color',
      group: 'Color',
      control: 'color',
      default: 'rgba(255,255,255,0.6)',
    },
    {
      key: 'accentColor',
      label: 'Accent Color',
      group: 'Color',
      control: 'color',
      default: '#39FF14',
    },
    {
      key: 'fontFamily',
      label: 'Font',
      group: 'Typography',
      control: 'font',
      default: 'sf-pro-display',
      options: [
        { value: 'sf-pro-display', label: 'SF Pro Display' },
        { value: 'neue-haas-display', label: 'Neue Haas Display' },
        ...FONT_OPTIONS,
      ],
    },
  ],
  component: TitleRevealComposition,
}
