import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { SPRING_CONFIGS, EASING } from '../../utils/easing'
import { useFont, getFontFamily } from '../../utils/useFont'
import type { KineticTypographyProps } from './definition'

function getFont(fontFamily: string): string {
  switch (fontFamily) {
    case 'sf-pro-display': return '"SF Pro Display", system-ui, sans-serif'
    case 'neue-haas-display': return '"Neue Haas Display", "Helvetica Neue", sans-serif'
    default: return getFontFamily(fontFamily)
  }
}

export const KineticTypographyComposition: React.FC<{
  frame: number
  props: KineticTypographyProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { phrase, backgroundColor, textColor, fontFamily, fontWeight, fontSize, staggerDelay, animationStyle } = props

  useFont(String(fontFamily))
  const words = String(phrase).split(' ')
  const font = getFont(String(fontFamily))
  const scale = width / 1920
  const baseFontSize = Math.round(80 * scale * Number(fontSize))

  const containerStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: String(backgroundColor),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    gap: Math.round(16 * scale),
    padding: Math.round(80 * scale),
    fontFamily: font,
    fontWeight: Number(fontWeight),
    fontSize: baseFontSize,
    overflow: 'hidden',
  }

  return (
    <div style={containerStyle}>
      {words.map((word, i) => {
        const delay = i * Number(staggerDelay)
        const elapsed = Math.max(0, frame - delay)

        let opacity = 1
        let translateY = 0
        let translateX = 0
        let wordScale = 1
        let blur = 0

        if (animationStyle === 'scale-fade') {
          const s = spring({ fps, frame: elapsed, config: SPRING_CONFIGS.snappy, durationInFrames: 35 })
          wordScale = 0.7 + 0.3 * s
          opacity = interpolate(elapsed, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        } else if (animationStyle === 'slide-blur') {
          opacity = interpolate(elapsed, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
          translateY = interpolate(elapsed, [0, 25], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })
          blur = interpolate(elapsed, [0, 15], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        } else {
          // pop
          const s = spring({ fps, frame: elapsed, config: SPRING_CONFIGS.bouncy, durationInFrames: 30 })
          wordScale = s
          opacity = interpolate(elapsed, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        }

        return (
          <span
            key={i}
            style={{
              color: String(textColor),
              opacity,
              transform: `translate(${translateX}px, ${translateY}px) scale(${wordScale})`,
              filter: blur > 0 ? `blur(${blur}px)` : undefined,
              display: 'inline-block',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}
