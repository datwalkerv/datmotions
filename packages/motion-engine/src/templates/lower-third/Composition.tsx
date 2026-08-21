import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { SPRING_CONFIGS, EASING } from '../../utils/easing'
import type { LowerThirdProps } from './definition'

function getFont(fontFamily: string): string {
  switch (fontFamily) {
    case 'sf-pro-display': return '"SF Pro Display", system-ui, sans-serif'
    case 'neue-haas-display': return '"Neue Haas Display", "Helvetica Neue", sans-serif'
    default: return 'system-ui, sans-serif'
  }
}

export const LowerThirdComposition: React.FC<{
  frame: number
  props: LowerThirdProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { name, title, accentColor, backgroundColor, textColor, subtitleColor, fontFamily, position, animationStyle, holdDuration } = props

  const scale = width / 1920
  const font = getFont(String(fontFamily))
  const hold = Number(holdDuration)

  const enterDuration = 25
  const exitStart = enterDuration + hold

  // Accent line animates in first
  const lineWidth = interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })
  const lineExit = interpolate(frame, [exitStart + 10, exitStart + 20], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const lineScale = Math.min(lineWidth, lineExit)

  let translateX = 0
  let opacity = 1

  if (animationStyle === 'slide-left') {
    const enterSpring = spring({ fps, frame, config: SPRING_CONFIGS.snappy, durationInFrames: enterDuration })
    const exitProgress = interpolate(frame, [exitStart, exitStart + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeInOutQuart })
    // Slide direction matches position: left slides from/to left edge, right from/to right edge
    const offscreen = position === 'right' ? 400 * scale : -400 * scale
    translateX = (1 - enterSpring) * offscreen + exitProgress * offscreen
  } else if (animationStyle === 'fade') {
    const enterOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
    const exitOpacity = interpolate(frame, [exitStart, exitStart + 15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    opacity = Math.min(enterOpacity, exitOpacity)
  } else {
    // wipe — clip-path reveal
    const enterOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    const exitOpacity = interpolate(frame, [exitStart, exitStart + 15], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    opacity = Math.min(enterOpacity, exitOpacity)
  }

  const positionAlign = position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center'
  const positionX = position === 'left' ? Math.round(80 * scale) : position === 'right' ? width - Math.round(80 * scale) : width / 2
  const textAlign = position === 'center' ? 'center' as const : 'left' as const

  return (
    <div style={{
      width,
      height,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Lower third bar */}
      <div style={{
        position: 'absolute',
        bottom: Math.round(80 * scale),
        left: position === 'left' ? Math.round(80 * scale) : position === 'right' ? 'auto' : '50%',
        right: position === 'right' ? Math.round(80 * scale) : 'auto',
        transform: position === 'center'
          ? `translateX(-50%) translateX(${translateX}px)`
          : `translateX(${translateX}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: positionAlign,
        gap: Math.round(10 * scale),
        fontFamily: font,
      }}>
        {/* Accent line */}
        <div style={{
          height: Math.round(2 * scale),
          width: Math.round(200 * scale * lineScale),
          backgroundColor: String(accentColor),
          borderRadius: 1,
        }} />

        {/* Text block */}
        <div style={{
          padding: `${Math.round(14 * scale)}px ${Math.round(20 * scale)}px`,
          backgroundColor: String(backgroundColor),
          borderRadius: Math.round(6 * scale),
          textAlign,
        }}>
          <div style={{
            fontSize: Math.round(28 * scale),
            fontWeight: 700,
            color: String(textColor),
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}>
            {String(name)}
          </div>
          <div style={{
            fontSize: Math.round(18 * scale),
            fontWeight: 400,
            color: String(subtitleColor),
            marginTop: Math.round(4 * scale),
            letterSpacing: '0.01em',
          }}>
            {String(title)}
          </div>
        </div>
      </div>
    </div>
  )
}
