import type { TemplateDefinition } from '../schema'
import { SocialCalloutComposition } from './Composition'

export type SocialCalloutProps = {
  text: string
  subtext: string
  emoji: string
  pillText: string
  backgroundColor: string
  cardColor: string
  textColor: string
  accentColor: string
  animationStyle: 'pop' | 'slide-up' | 'spring-in'
  cornerRadius: number
  staggerDelay: number
  [key: string]: unknown
}

export const socialCalloutDefinition: TemplateDefinition<SocialCalloutProps> = {
  id: 'social-callout',
  name: 'Modern Social Callout',
  category: 'social',
  thumbnail: '/thumbnails/social-callout.jpg',
  fps: 60,
  defaultDurationInFrames: 180,
  supportedFormats: ['1:1', '9:16'],
  defaultProps: {
    text: 'New Feature Drop',
    subtext: 'Available now on all platforms',
    emoji: '⚡',
    pillText: 'Available Now',
    backgroundColor: '#0A0A0B',
    cardColor: '#18181B',
    textColor: '#F4F4F5',
    accentColor: '#39FF14',
    animationStyle: 'pop',
    cornerRadius: 24,
    staggerDelay: 7,
  },
  schema: [
    { key: 'text', label: 'Headline', group: 'Content', control: 'text', default: 'New Feature Drop' },
    { key: 'subtext', label: 'Subtext', group: 'Content', control: 'text', default: 'Available now on all platforms' },
    { key: 'emoji', label: 'Emoji', group: 'Content', control: 'text', default: '⚡' },
    { key: 'pillText', label: 'Pill Text', group: 'Content', control: 'text', default: 'Available Now' },
    { key: 'animationStyle', label: 'Animation Style', group: 'Animation', control: 'select', default: 'pop', options: [
      { value: 'pop', label: 'Pop' },
      { value: 'slide-up', label: 'Slide Up' },
      { value: 'spring-in', label: 'Spring In' },
    ]},
    { key: 'staggerDelay', label: 'Stagger Delay (frames)', group: 'Animation', control: 'slider', default: 7, min: 0, max: 20, step: 1 },
    { key: 'cornerRadius', label: 'Corner Radius', group: 'Layout', control: 'slider', default: 24, min: 0, max: 60, step: 2 },
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
    { key: 'cardColor', label: 'Card Color', group: 'Color', control: 'color', default: '#18181B' },
    { key: 'textColor', label: 'Text Color', group: 'Color', control: 'color', default: '#F4F4F5' },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF14' },
  ],
  component: SocialCalloutComposition,
}
