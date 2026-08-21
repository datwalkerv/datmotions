import type { TemplateDefinition } from '../schema'
import { DataChartComposition } from './Composition'
import { FONT_OPTIONS } from '../../utils/useFont'

export type DataChartProps = {
  title: string
  subtitle: string
  bar1Label: string
  bar1Value: number
  bar1Color: string
  bar2Label: string
  bar2Value: number
  bar2Color: string
  bar3Label: string
  bar3Value: number
  bar3Color: string
  bar4Label: string
  bar4Value: number
  bar4Color: string
  backgroundColor: string
  textColor: string
  trackColor: string
  fontFamily: string
  animationStyle: 'stagger' | 'simultaneous'
  showValues: 'yes' | 'no'
  showPercentage: 'yes' | 'no'
  [key: string]: unknown
}

export const dataChartDefinition: TemplateDefinition<DataChartProps> = {
  id: 'data-chart',
  name: 'Animated Bar Chart',
  category: 'data',
  thumbnail: '/thumbnails/data-chart.jpg',
  fps: 60,
  defaultDurationInFrames: 210,
  supportedFormats: ['16:9', '1:1'],
  defaultProps: {
    title: 'Q4 Performance',
    subtitle: 'Year-over-year growth metrics',
    bar1Label: 'Revenue', bar1Value: 87, bar1Color: '#39FF88',
    bar2Label: 'Users', bar2Value: 64, bar2Color: '#7C3AED',
    bar3Label: 'Retention', bar3Value: 92, bar3Color: '#F59E0B',
    bar4Label: 'NPS Score', bar4Value: 78, bar4Color: '#3B82F6',
    backgroundColor: '#0A0A0B',
    textColor: '#F4F4F5',
    trackColor: 'rgba(255,255,255,0.07)',
    fontFamily: 'space-grotesk',
    animationStyle: 'stagger',
    showValues: 'yes',
    showPercentage: 'yes',
  },
  schema: [
    { key: 'title', label: 'Title', group: 'Content', control: 'text', default: 'Q4 Performance' },
    { key: 'subtitle', label: 'Subtitle', group: 'Content', control: 'text', default: 'Year-over-year growth metrics' },
    { key: 'bar1Label', label: 'Bar 1 Label', group: 'Bar 1', control: 'text', default: 'Revenue' },
    { key: 'bar1Value', label: 'Bar 1 Value', group: 'Bar 1', control: 'slider', default: 87, min: 0, max: 100, step: 1 },
    { key: 'bar1Color', label: 'Bar 1 Color', group: 'Bar 1', control: 'color', default: '#39FF88' },
    { key: 'bar2Label', label: 'Bar 2 Label', group: 'Bar 2', control: 'text', default: 'Users' },
    { key: 'bar2Value', label: 'Bar 2 Value', group: 'Bar 2', control: 'slider', default: 64, min: 0, max: 100, step: 1 },
    { key: 'bar2Color', label: 'Bar 2 Color', group: 'Bar 2', control: 'color', default: '#7C3AED' },
    { key: 'bar3Label', label: 'Bar 3 Label', group: 'Bar 3', control: 'text', default: 'Retention' },
    { key: 'bar3Value', label: 'Bar 3 Value', group: 'Bar 3', control: 'slider', default: 92, min: 0, max: 100, step: 1 },
    { key: 'bar3Color', label: 'Bar 3 Color', group: 'Bar 3', control: 'color', default: '#F59E0B' },
    { key: 'bar4Label', label: 'Bar 4 Label', group: 'Bar 4', control: 'text', default: 'NPS Score' },
    { key: 'bar4Value', label: 'Bar 4 Value', group: 'Bar 4', control: 'slider', default: 78, min: 0, max: 100, step: 1 },
    { key: 'bar4Color', label: 'Bar 4 Color', group: 'Bar 4', control: 'color', default: '#3B82F6' },
    { key: 'animationStyle', label: 'Animation', group: 'Animation', control: 'select', default: 'stagger', options: [
      { value: 'stagger', label: 'Stagger' },
      { value: 'simultaneous', label: 'Simultaneous' },
    ]},
    { key: 'showValues', label: 'Show Values', group: 'Display', control: 'select', default: 'yes', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { key: 'showPercentage', label: 'Show % Symbol', group: 'Display', control: 'select', default: 'yes', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] },
    { key: 'fontFamily', label: 'Font', group: 'Typography', control: 'font', default: 'space-grotesk', options: FONT_OPTIONS },
    { key: 'backgroundColor', label: 'Background', group: 'Color', control: 'color', default: '#0A0A0B' },
    { key: 'textColor', label: 'Text Color', group: 'Color', control: 'color', default: '#F4F4F5' },
    { key: 'trackColor', label: 'Track Color', group: 'Color', control: 'color', default: 'rgba(255,255,255,0.07)' },
  ],
  component: DataChartComposition,
}
