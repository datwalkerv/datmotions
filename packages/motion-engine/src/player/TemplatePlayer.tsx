'use client'
import React from 'react'
import { Player } from '@remotion/player'
import { useCurrentFrame } from 'remotion'
import type { TemplateDefinition } from '../templates/schema'

interface TemplatePlayerProps<TProps extends Record<string, unknown>> {
  template: TemplateDefinition<TProps>
  props: TProps
  width?: number
  height?: number
  loop?: boolean
  autoPlay?: boolean
  controls?: boolean
  style?: React.CSSProperties
}

export function TemplatePlayer<TProps extends Record<string, unknown>>({
  template,
  props,
  width = 1920,
  height = 1080,
  loop = true,
  autoPlay = false,
  controls = false,
  style,
}: TemplatePlayerProps<TProps>) {
  const aspectRatio = width / height
  const displayWidth = style?.width ? parseInt(String(style.width)) : 640
  const displayHeight = Math.round(displayWidth / aspectRatio)

  const WrappedComponent = React.useMemo(() => {
    const Comp = template.component
    return function Composition() {
      const frame = useCurrentFrame()
      return <Comp frame={frame} props={props} width={width} height={height} />
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id, props, width, height])

  return (
    <Player
      component={WrappedComponent}
      durationInFrames={template.defaultDurationInFrames}
      fps={template.fps}
      compositionWidth={width}
      compositionHeight={height}
      loop={loop}
      autoPlay={autoPlay}
      controls={controls}
      style={{ width: displayWidth, height: displayHeight, ...style }}
    />
  )
}
