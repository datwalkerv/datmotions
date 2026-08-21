import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { EASING, SPRING_CONFIGS, fadeIn, slideUp } from '../../utils/easing'
import { useFont, getFontFamily } from '../../utils/useFont'
import type { TitleRevealProps } from './definition'

function getFont(fontFamily: string): string {
  switch (fontFamily) {
    case 'sf-pro-display':
      return '"SF Pro Display", system-ui, sans-serif'
    case 'neue-haas-display':
      return '"Neue Haas Display", "Helvetica Neue", sans-serif'
    default:
      return getFontFamily(fontFamily)
  }
}

export const TitleRevealComposition: React.FC<{
  frame: number
  props: TitleRevealProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const {
    headline,
    subline,
    backgroundColor,
    headlineColor,
    sublineColor,
    animationStyle,
  } = props

  useFont(props.fontFamily)
  const font = getFont(props.fontFamily)
  const scale = width / 1920

  const headlineDelay = 10
  const sublineDelay = headlineDelay + 18

  let headlineOpacity = 1
  let headlineY = 0
  let headlineBlur = 0
  let sublineOpacity = 1
  let sublineY = 0

  if (animationStyle === 'blur-rise') {
    headlineOpacity = fadeIn({ frame, startFrame: headlineDelay, durationFrames: 20 })
    headlineY = slideUp({ frame, startFrame: headlineDelay, durationFrames: 30, distance: 30 })
    headlineBlur = interpolate(frame, [headlineDelay, headlineDelay + 20], [12, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASING.easeOutQuart,
    })
    sublineOpacity = fadeIn({ frame, startFrame: sublineDelay, durationFrames: 20 })
    sublineY = slideUp({ frame, startFrame: sublineDelay, durationFrames: 30, distance: 20 })
  } else if (animationStyle === 'slide-up') {
    const hs = spring({
      fps,
      frame: Math.max(0, frame - headlineDelay),
      config: SPRING_CONFIGS.snappy,
      durationInFrames: 40,
    })
    headlineOpacity = interpolate(frame, [headlineDelay, headlineDelay + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    headlineY = (1 - hs) * 60
    const ss = spring({
      fps,
      frame: Math.max(0, frame - sublineDelay),
      config: SPRING_CONFIGS.snappy,
      durationInFrames: 40,
    })
    sublineOpacity = interpolate(frame, [sublineDelay, sublineDelay + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    sublineY = (1 - ss) * 40
  } else {
    headlineOpacity = fadeIn({ frame, startFrame: headlineDelay, durationFrames: 25 })
    sublineOpacity = fadeIn({ frame, startFrame: sublineDelay, durationFrames: 25 })
  }

  const containerStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: font,
    overflow: 'hidden',
    position: 'relative',
  }

  const headlineStyle: React.CSSProperties = {
    fontSize: Math.round(96 * scale),
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: headlineColor,
    margin: 0,
    lineHeight: 1.05,
    opacity: headlineOpacity,
    transform: `translateY(${headlineY}px)`,
    filter: headlineBlur > 0 ? `blur(${headlineBlur}px)` : undefined,
    textAlign: 'center',
    maxWidth: '85%',
  }

  const sublineStyle: React.CSSProperties = {
    fontSize: Math.round(36 * scale),
    fontWeight: 400,
    letterSpacing: '0.01em',
    color: sublineColor,
    margin: 0,
    marginTop: Math.round(20 * scale),
    lineHeight: 1.3,
    opacity: sublineOpacity,
    transform: `translateY(${sublineY}px)`,
    textAlign: 'center',
    maxWidth: '80%',
  }

  return (
    <div style={containerStyle}>
      <p style={headlineStyle}>{headline}</p>
      <p style={sublineStyle}>{subline}</p>
    </div>
  )
}
