import type { TemplateDefinition } from '../schema'
import { CountdownComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type CountdownProps = {
  startFrom: number
  label: string
  subLabel: string
  numberColor: string
  labelColor: string
  accentColor: string
  backgroundColor: string
  fontFamily: string
  showRing: 'ring' | 'bar' | 'none'
  ringThickness: number
  direction: 'down' | 'up'
  [key: string]: unknown
}

export const countdownDefinition: TemplateDefinition<CountdownProps> = {
  id: 'countdown',
  name: 'Countdown Timer',
  category: 'motion',
  thumbnail: '/thumbnails/countdown.jpg',
  fps: 60,
  defaultDurationInFrames: 300,
  supportedFormats: ['1:1', '9:16'],
  defaultProps: {
    startFrom: 10,
    label: 'DAYS LEFT',
    subLabel: 'Until launch',
    numberColor: '#F4F4F5',
    labelColor: 'rgba(244,244,245,0.5)',
    accentColor: '#39FF14',
    backgroundColor: '#0A0A0B',
    fontFamily: 'space-grotesk',
    showRing: 'ring',
    ringThickness: 6,
    direction: 'down',
  },
  schema: [
    { key: 'startFrom', label: 'Count From', group: 'Content', control: 'slider', default: 10, min: 1, max: 99, step: 1 },
    { key: 'label', label: 'Label', group: 'Content', control: 'text', default: 'DAYS LEFT' },
    { key: 'subLabel', label: 'Sub Label', group: 'Content', control: 'text', default: 'Until launch' },
    { key: 'direction', label: 'Direction', group: 'Animation', control: 'select', default: 'down', options: [
      { value: 'down', label: 'Count Down' },
      { value: 'up', label: 'Count Up' },
    ]},
    { key: 'showRing', label: 'Progress Indicator', group: 'Animation', control: 'select', default: 'ring', options: [
      { value: 'ring', label: 'Circle Ring' },
      { value: 'bar', label: 'Progress Bar' },
      { value: 'none', label: 'None' },
    ]},
    { key: 'ringThickness', label: 'Ring Thickness', group: 'Animation', control: 'slider', default: 6, min: 2, max: 20, step: 1 },
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'space-grotesk', options: FONT_OPTIONS },
    { key: 'accentColor', label: 'Accent Color', group: 'Color', control: 'color', default: '#39FF14' },
    { key: 'numberColor', label: 'Number Color', group: 'Color', control: 'color', default: '#F4F4F5' },
    { key: 'labelColor', label: 'Label Color', group: 'Color', control: 'color', default: 'rgba(244,244,245,0.5)' },
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
  ],
  component: CountdownComposition,
}
