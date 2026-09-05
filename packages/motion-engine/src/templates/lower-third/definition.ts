import type { TemplateDefinition } from '../schema'
import { LowerThirdComposition } from './Composition'

export type LowerThirdProps = {
  name: string
  title: string
  accentColor: string
  backgroundColor: string
  textColor: string
  subtitleColor: string
  fontFamily: 'sf-pro-display' | 'neue-haas-display'
  position: 'left' | 'center' | 'right'
  animationStyle: 'slide-left' | 'fade' | 'wipe'
  holdDuration: number
  [key: string]: unknown
}

export const lowerThirdDefinition: TemplateDefinition<LowerThirdProps> = {
  id: 'lower-third',
  name: 'Minimal Lower Third',
  category: 'lower-third',
  thumbnail: '/thumbnails/lower-third.jpg',
  fps: 60,
  defaultDurationInFrames: 210,
  supportedFormats: ['16:9'],
  defaultProps: {
    name: 'Jane Smith',
    title: 'Creative Director',
    accentColor: '#39FF14',
    backgroundColor: 'rgba(0,0,0,0.85)',
    textColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.7)',
    fontFamily: 'sf-pro-display',
    position: 'left',
    animationStyle: 'slide-left',
    holdDuration: 120,
  },
  schema: [
    { key: 'name', label: 'Name', group: 'Content', control: 'text', default: 'Jane Smith' },
    { key: 'title', label: 'Title', group: 'Content', control: 'text', default: 'Creative Director' },
    { key: 'animationStyle', label: 'Animation Style', group: 'Animation', control: 'select', default: 'slide-left', options: [
      { value: 'slide-left', label: 'Slide Left' },
      { value: 'fade', label: 'Fade' },
      { value: 'wipe', label: 'Wipe' },
    ]},
    { key: 'holdDuration', label: 'Hold (frames)', group: 'Animation', control: 'slider', default: 120, min: 30, max: 180, step: 10 },
    { key: 'position', label: 'Position', group: 'Layout', control: 'select', default: 'left', options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ]},
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'sf-pro-display', options: [
      { value: 'sf-pro-display', label: 'SF Pro Display' },
      { value: 'neue-haas-display', label: 'Neue Haas Display' },
    ]},
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: 'rgba(0,0,0,0.85)' },
    { key: 'textColor', label: 'Name Color', group: 'Color', control: 'color', default: '#FFFFFF' },
    { key: 'subtitleColor', label: 'Title Color', group: 'Color', control: 'color', default: 'rgba(255,255,255,0.7)' },
    { key: 'accentColor', label: 'Accent Line Color', group: 'Color', control: 'color', default: '#39FF14' },
  ],
  component: LowerThirdComposition,
}
