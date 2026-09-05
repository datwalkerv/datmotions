import type { TemplateDefinition } from '../schema'
import { GradientRevealComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type GradientRevealProps = {
  headline: string
  subheadline: string
  eyebrow: string
  gradientFrom: string
  gradientTo: string
  backgroundColor: string
  fontFamily: string
  animationStyle: 'sweep' | 'stagger' | 'wipe'
  textAlign: 'left' | 'center'
  [key: string]: unknown
}

export const gradientRevealDefinition: TemplateDefinition<GradientRevealProps> = {
  id: 'gradient-reveal',
  name: 'Gradient Reveal',
  category: 'title',
  thumbnail: '/thumbnails/gradient-reveal.jpg',
  fps: 60,
  defaultDurationInFrames: 180,
  supportedFormats: ['16:9', '9:16', '1:1'],
  defaultProps: {
    headline: 'Design the\nFuture',
    subheadline: 'Motion that moves people',
    eyebrow: 'Introducing',
    gradientFrom: '#39FF14',
    gradientTo: '#7C3AED',
    backgroundColor: '#08080F',
    fontFamily: 'syne',
    animationStyle: 'sweep',
    textAlign: 'left',
  },
  schema: [
    { key: 'headline', label: 'Headline', group: 'Content', control: 'text', default: 'Design the\nFuture' },
    { key: 'subheadline', label: 'Subheadline', group: 'Content', control: 'text', default: 'Motion that moves people' },
    { key: 'eyebrow', label: 'Eyebrow Text', group: 'Content', control: 'text', default: 'Introducing' },
    { key: 'animationStyle', label: 'Animation Style', group: 'Animation', control: 'select', default: 'sweep', options: [
      { value: 'sweep', label: 'Gradient Sweep' },
      { value: 'stagger', label: 'Word Stagger' },
      { value: 'wipe', label: 'Wipe Reveal' },
    ]},
    { key: 'textAlign', label: 'Alignment', group: 'Layout', control: 'select', default: 'left', options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
    ]},
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'syne', options: FONT_OPTIONS },
    { key: 'gradientFrom', label: 'Gradient Start', group: 'Color', control: 'color', default: '#39FF14' },
    { key: 'gradientTo', label: 'Gradient End', group: 'Color', control: 'color', default: '#7C3AED' },
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#08080F' },
  ],
  component: GradientRevealComposition,
}
