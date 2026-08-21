import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { EASING, SPRING_CONFIGS } from '../../utils/easing'
import { useFont, getFontFamily } from '../../utils/useFont'
import type { QuoteProps } from './definition'

function getFont(fontFamily: string): string {
  switch (fontFamily) {
    case 'fraunces': return '"Fraunces", Georgia, serif'
    case 'sf-pro-display': return '"SF Pro Display", system-ui, sans-serif'
    default: return getFontFamily(fontFamily)
  }
}

export const QuoteComposition: React.FC<{
  frame: number
  props: QuoteProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { quote, attribution, backgroundColor, quoteColor, attributionColor, accentColor, fontFamily, animationStyle } = props

  useFont(String(fontFamily))
  const scale = width / 1920
  const font = getFont(String(fontFamily))
  const isSerif = fontFamily === 'fraunces'

  // Strip surrounding quotes from the text — we render our own decorative mark
  const cleanQuote = String(quote).replace(/^["""'']+|["""'']+$/g, '').trim()
  const words = cleanQuote.split(/\s+/)

  // Timing constants
  const openMarkStart = 0
  const openMarkEnd = 20
  const quoteStartBase = 18
  const staggerPerWord = 4   // frames between each word
  const lastWordEnd = quoteStartBase + words.length * staggerPerWord + 20
  const lineStart = lastWordEnd + 4
  const lineEnd = lineStart + 22
  const attrStart = lineEnd - 4
  const attrEnd = attrStart + 24

  // Opening quotation mark — spring in from above-left
  const openMarkSpring = spring({ fps, frame: Math.max(0, frame - openMarkStart), config: SPRING_CONFIGS.snappy, durationInFrames: 30 })
  const openMarkOpacity = interpolate(frame, [openMarkStart, openMarkEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const openMarkY = (1 - openMarkSpring) * -24

  // Separator line width
  const lineWidth = interpolate(frame, [lineStart, lineEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  // Attribution
  const attrOpacity = interpolate(frame, [attrStart, attrEnd], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const attrY = interpolate(frame, [attrStart, attrEnd + 10], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  // Per-word animation
  function wordStyle(index: number): React.CSSProperties {
    const wordStart = quoteStartBase + index * staggerPerWord
    const elapsed = Math.max(0, frame - wordStart)

    if (animationStyle === 'mask-reveal') {
      // Clip reveal: words slide up from below into a mask
      const s = spring({ fps, frame: elapsed, config: { damping: 22, stiffness: 280, mass: 1 }, durationInFrames: 28 })
      const opacity = interpolate(frame, [wordStart, wordStart + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      return {
        display: 'inline-block',
        opacity,
        transform: `translateY(${(1 - s) * 28}px)`,
        marginRight: Math.round(12 * scale),
      }
    } else if (animationStyle === 'fade-up') {
      const s = spring({ fps, frame: elapsed, config: SPRING_CONFIGS.gentle, durationInFrames: 32 })
      const opacity = interpolate(frame, [wordStart, wordStart + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      return {
        display: 'inline-block',
        opacity,
        transform: `translateY(${(1 - s) * 20}px)`,
        marginRight: Math.round(12 * scale),
      }
    } else {
      // blur-in: each word fades + unblurs
      const opacity = interpolate(frame, [wordStart, wordStart + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      const blur = interpolate(frame, [wordStart, wordStart + 22], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      const scale2 = interpolate(frame, [wordStart, wordStart + 20], [0.88, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })
      return {
        display: 'inline-block',
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transform: `scale(${scale2})`,
        transformOrigin: 'center bottom',
        marginRight: Math.round(12 * scale),
      }
    }
  }

  const fontSize = Math.round(58 * scale)
  const maxTextWidth = Math.round(0.72 * width)
  const decorMarkSize = Math.round(120 * scale)

  return (
    <div style={{
      width,
      height,
      backgroundColor: String(backgroundColor),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: font,
    }}>
      {/* Background decorative large quote mark */}
      <div style={{
        position: 'absolute',
        top: Math.round(60 * scale),
        left: Math.round(80 * scale),
        fontSize: Math.round(320 * scale),
        lineHeight: 1,
        color: String(accentColor),
        opacity: 0.06,
        fontFamily: 'Georgia, serif',
        fontWeight: 700,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        "
      </div>

      <div style={{
        position: 'relative',
        paddingLeft: Math.round(100 * scale),
        paddingRight: Math.round(100 * scale),
        width: '100%',
      }}>
        {/* Accent opening mark */}
        <div style={{
          fontSize: decorMarkSize,
          color: String(accentColor),
          lineHeight: 0.8,
          marginBottom: Math.round(16 * scale),
          opacity: openMarkOpacity,
          transform: `translateY(${openMarkY}px)`,
          fontFamily: isSerif ? font : 'Georgia, serif',
          fontWeight: isSerif ? 600 : 400,
        }}>
          "
        </div>

        {/* Quote words — inline so they wrap naturally */}
        <div style={{
          maxWidth: maxTextWidth,
          overflow: 'hidden',
        }}>
          <p style={{
            fontSize,
            fontWeight: isSerif ? 600 : 300,
            fontStyle: isSerif ? 'italic' : 'normal',
            color: String(quoteColor),
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: isSerif ? '-0.01em' : '-0.03em',
            wordSpacing: Math.round(2 * scale),
          }}>
            {words.map((word, i) => (
              <span key={i} style={wordStyle(i)}>{word}</span>
            ))}
          </p>
        </div>

        {/* Separator line */}
        <div style={{
          marginTop: Math.round(36 * scale),
          height: Math.round(1.5 * scale),
          width: Math.round(lineWidth * 120 * scale),
          backgroundColor: String(accentColor),
          borderRadius: 2,
        }} />

        {/* Attribution */}
        <p style={{
          fontSize: Math.round(22 * scale),
          fontWeight: 400,
          fontStyle: 'normal',
          letterSpacing: '0.04em',
          color: String(attributionColor),
          marginTop: Math.round(18 * scale),
          marginBottom: 0,
          opacity: attrOpacity,
          transform: `translateY(${attrY}px)`,
          textTransform: 'uppercase',
        }}>
          {String(attribution)}
        </p>
      </div>
    </div>
  )
}
