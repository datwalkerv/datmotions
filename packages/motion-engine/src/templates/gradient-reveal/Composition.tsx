import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { useFont, getFontFamily } from '../../utils/useFont'
import { EASING, SPRING_CONFIGS } from '../../utils/easing'
import type { GradientRevealProps } from './definition'

export const GradientRevealComposition: React.FC<{
  frame: number
  props: GradientRevealProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { headline, subheadline, eyebrow, gradientFrom, gradientTo, backgroundColor, fontFamily, animationStyle, textAlign } = props
  useFont(String(fontFamily))
  const font = getFontFamily(String(fontFamily))
  const scale = width / 1920
  const lines = String(headline).split('\n')
  const gradient = `linear-gradient(90deg, ${String(gradientFrom)}, ${String(gradientTo)})`
  const align = textAlign === 'center' ? 'center' as const : 'left' as const
  const padX = textAlign === 'center' ? Math.round(80 * scale) : Math.round(120 * scale)
  const isBebas = fontFamily === 'bebas'

  const eyebrowProgress = spring({ fps, frame: Math.max(0, frame), config: SPRING_CONFIGS.gentle, durationInFrames: 28 })
  const eyebrowOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })

  function lineStyle(lineIndex: number): React.CSSProperties {
    const lineStart = 18 + lineIndex * 20
    const elapsed = Math.max(0, frame - lineStart)

    if (animationStyle === 'sweep') {
      const progress = interpolate(frame, [lineStart, lineStart + 45], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo,
      })
      const opacity = interpolate(frame, [lineStart, lineStart + 10], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
      return {
        clipPath: `inset(0 ${Math.round((1 - progress) * 100)}% 0 0)`,
        opacity,
        display: 'block',
      }
    } else if (animationStyle === 'stagger') {
      const s = spring({ fps, frame: elapsed, config: SPRING_CONFIGS.snappy, durationInFrames: 32 })
      const opacity = interpolate(frame, [lineStart, lineStart + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      return {
        display: 'block',
        opacity,
        transform: `translateY(${(1 - s) * 60}px)`,
      }
    } else {
      const progress = interpolate(frame, [lineStart, lineStart + 35], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo,
      })
      return {
        display: 'block',
        clipPath: `inset(0 ${Math.round((1 - progress) * 102)}% 0 0)`,
      }
    }
  }

  const lastLineStart = 18 + (lines.length - 1) * 20
  const subStart = lastLineStart + 50
  const subOpacity = interpolate(frame, [subStart, subStart + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const subY = interpolate(frame, [subStart, subStart + 28], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  const fontSize = Math.round(108 * scale)

  return (
    <div style={{
      width,
      height,
      backgroundColor: String(backgroundColor),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: `0 ${padX}px`,
      fontFamily: font,
      overflow: 'hidden',
    }}>
      {eyebrow && (
        <div style={{
          fontSize: Math.round(14 * scale),
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: Math.round(24 * scale),
          opacity: eyebrowOpacity,
          transform: `translateY(${(1 - eyebrowProgress) * 16}px)`,
          textAlign: align,
        }}>
          {String(eyebrow)}
        </div>
      )}

      <div style={{ textAlign: align }}>
        {lines.map((line, i) => (
          <span key={i} style={{
            fontSize: isBebas ? Math.round(140 * scale) : fontSize,
            fontWeight: isBebas ? 400 : 800,
            lineHeight: isBebas ? 0.9 : 1.0,
            letterSpacing: isBebas ? '0.04em' : '-0.04em',
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            ...lineStyle(i),
          }}>
            {line}
          </span>
        ))}
      </div>

      {subheadline && (
        <div style={{
          fontSize: Math.round(22 * scale),
          fontWeight: 400,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '-0.01em',
          marginTop: Math.round(32 * scale),
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          textAlign: align,
        }}>
          {String(subheadline)}
        </div>
      )}
    </div>
  )
}
