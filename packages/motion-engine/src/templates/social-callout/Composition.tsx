import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { SPRING_CONFIGS, EASING } from '../../utils/easing'
import type { SocialCalloutProps } from './definition'

export const SocialCalloutComposition: React.FC<{
  frame: number
  props: SocialCalloutProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { text, subtext, emoji, pillText, backgroundColor, cardColor, textColor, accentColor, animationStyle, cornerRadius, staggerDelay } = props

  const scale = width / 1080
  const cardStartFrame = 6
  const delay = isFinite(Number(staggerDelay)) ? Number(staggerDelay) : 7

  // Item indices: 0=card, 1=emoji, 2=text, 3=subtext, 4=pill
  function itemSpring(index: number, cfg = { damping: 12, stiffness: 280, mass: 1 }) {
    const start = cardStartFrame + index * delay
    return spring({ fps, frame: Math.max(0, frame - start), config: cfg, durationInFrames: 35 })
  }

  function itemOpacity(index: number, rampFrames = 8) {
    const start = cardStartFrame + index * delay
    return interpolate(frame, [start, start + rampFrames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  }

  // Card enters first, then items stagger inside
  let cardScale = 1
  let cardOpacity = 1
  let cardY = 0

  if (animationStyle === 'pop') {
    const s = itemSpring(0, { damping: 10, stiffness: 250, mass: 1 })
    cardScale = s
    cardOpacity = itemOpacity(0, 6)
  } else if (animationStyle === 'slide-up') {
    const s = itemSpring(0, SPRING_CONFIGS.snappy)
    cardOpacity = itemOpacity(0, 10)
    cardY = (1 - s) * 80
  } else {
    const s = itemSpring(0, SPRING_CONFIGS.gentle)
    cardScale = 0.85 + 0.15 * s
    cardOpacity = itemOpacity(0, 12)
  }

  // Individual item spring (pop style for all items regardless of card style)
  function elemStyle(index: number): React.CSSProperties {
    const s = itemSpring(index, { damping: 12, stiffness: 300, mass: 0.9 })
    const op = itemOpacity(index, 7)
    return {
      opacity: op,
      transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 18}px)`,
    }
  }

  const cardPad = Math.round(40 * scale)
  const cardWidth = Math.round(640 * scale)

  return (
    <div style={{
      width,
      height,
      backgroundColor: String(backgroundColor),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        width: cardWidth,
        backgroundColor: String(cardColor),
        borderRadius: Math.round(Number(cornerRadius) * scale),
        padding: cardPad,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: Math.round(20 * scale),
        opacity: cardOpacity,
        transform: `scale(${cardScale}) translateY(${cardY}px)`,
        border: `1px solid rgba(255,255,255,0.1)`,
        boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset`,
      }}>
        {/* Emoji */}
        <div style={{ fontSize: Math.round(72 * scale), lineHeight: 1, ...elemStyle(1) }}>
          {String(emoji)}
        </div>

        {/* Headline */}
        <p style={{
          fontSize: Math.round(34 * scale),
          fontWeight: 700,
          color: String(textColor),
          margin: 0,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          fontFamily: '"SF Pro Display", system-ui, sans-serif',
          textAlign: 'center',
          ...elemStyle(2),
        }}>
          {String(text)}
        </p>

        {/* Subtext */}
        <p style={{
          fontSize: Math.round(19 * scale),
          fontWeight: 400,
          color: `rgba(244,244,245,0.55)`,
          margin: 0,
          letterSpacing: '0.005em',
          fontFamily: '"SF Pro Display", system-ui, sans-serif',
          textAlign: 'center',
          lineHeight: 1.4,
          ...elemStyle(3),
        }}>
          {String(subtext)}
        </p>

        {/* Accent pill */}
        <div style={{
          padding: `${Math.round(8 * scale)}px ${Math.round(20 * scale)}px`,
          backgroundColor: String(accentColor),
          borderRadius: 100,
          fontSize: Math.round(13 * scale),
          fontWeight: 600,
          color: '#0A0A0B',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: '"SF Pro Display", system-ui, sans-serif',
          ...elemStyle(4),
        }}>
          {String(pillText ?? 'Available Now')}
        </div>
      </div>
    </div>
  )
}
