export type ControlType =
  | 'text'
  | 'textarea'
  | 'color'
  | 'gradient'
  | 'select'
  | 'slider'
  | 'number'
  | 'font'
  | 'toggle'
  | 'position2d'

export interface PropertyField<T = unknown> {
  key: string
  label: string
  group: string
  control: ControlType
  default: T
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  description?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PropertySchema<_TProps = unknown> = PropertyField[]

export type AspectRatio = '16:9' | '9:16' | '1:1'

export type TemplateCategory =
  | 'title'
  | 'lower-third'
  | 'stat'
  | 'quote'
  | 'kinetic'
  | 'social'
  | 'data'
  | 'motion'

export interface TemplateDefinition<TProps extends Record<string, unknown>> {
  id: string
  name: string
  category: TemplateCategory
  thumbnail: string
  schema: PropertySchema<TProps>
  defaultProps: TProps
  defaultDurationInFrames: number
  supportedFormats: AspectRatio[]
  fps: number
  component: React.FC<{
    frame: number
    props: TProps
    width: number
    height: number
  }>
}
