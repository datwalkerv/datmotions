import type { TemplateDefinition } from '../schema'
import { StatCounterComposition } from './Composition'

export type StatCounterProps = {
  value: number
  prefix: string
  suffix: string
  label: string
  backgroundColor: string
  numberColor: string
  labelColor: string
  accentColor: string
  countUpDuration: number
  easingStyle: 'expo' | 'linear' | 'spring'
  fontFamily: 'sf-pro-display' | 'neue-haas-display'
  [key: string]: unknown
}

export const statCounterDefinition: TemplateDefinition<StatCounterProps> = {
  id: 'stat-counter',
  name: 'Animated Stat Counter',
  category: 'stat',
  thumbnail: '/thumbnails/stat-counter.jpg',
  fps: 60,
  defaultDurationInFrames: 180,
  supportedFormats: ['16:9', '9:16', '1:1'],
  defaultProps: {
    value: 98,
    prefix: '',
    suffix: '%',
    label: 'Customer Satisfaction',
    backgroundColor: '#0A0A0B',
    numberColor: '#FFFFFF',
    labelColor: 'rgba(255,255,255,0.6)',
    accentColor: '#39FF88',
    countUpDuration: 90,
    easingStyle: 'expo',
    fontFamily: 'sf-pro-display',
  },
  schema: [
    { key: 'value', label: 'Number', group: 'Content', control: 'number', default: 98, min: 0, max: 9999 },
    { key: 'prefix', label: 'Prefix', group: 'Content', control: 'text', default: '' },
    { key: 'suffix', label: 'Suffix', group: 'Content', control: 'text', default: '%' },
    { key: 'label', label: 'Label', group: 'Content', control: 'text', default: 'Customer Satisfaction' },
    { key: 'countUpDuration', label: 'Count-up Duration (frames)', group: 'Animation', control: 'slider', default: 90, min: 20, max: 150, step: 5 },
    { key: 'easingStyle', label: 'Easing', group: 'Animation', control: 'select', default: 'expo', options: [
      { value: 'expo', label: 'Expo Out' },
      { value: 'linear', label: 'Linear' },
      { value: 'spring', label: 'Spring' },
    ]},
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'sf-pro-display', options: [
      { value: 'sf-pro-display', label: 'SF Pro Display' },
      { value: 'neue-haas-display', label: 'Neue Haas Display' },
    ]},
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
    { key: 'numberColor', label: 'Number Color', group: 'Color', control: 'color', default: '#FFFFFF' },
    { key: 'labelColor', label: 'Label Color', group: 'Color', control: 'color', default: 'rgba(255,255,255,0.6)' },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF88' },
  ],
  component: StatCounterComposition,
}
