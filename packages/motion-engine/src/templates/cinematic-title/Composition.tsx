import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { useFont, getFontFamily } from '../../utils/useFont'
import { EASING, SPRING_CONFIGS } from '../../utils/easing'
import type { CinematicTitleProps } from './definition'

export const CinematicTitleComposition: React.FC<{
  frame: number
  props: CinematicTitleProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { title, subtitle, eyebrow, director, backgroundColor, letterboxColor, textColor, accentColor, fontFamily, letterboxHeight, animationStyle } = props
  useFont(String(fontFamily))
  const font = getFontFamily(String(fontFamily))
  const scale = width / 1920

  const lbH = isFinite(Number(letterboxHeight)) ? Number(letterboxHeight) : 14
  const lbHeight = (lbH / 100) * height
  const isBebas = fontFamily === 'bebas'

  const barSpring = spring({ fps, frame: Math.max(0, frame), config: { damping: 20, stiffness: 80, mass: 1.5 }, durationInFrames: 50 })
  const topBarY = -(1 - barSpring) * lbHeight
  const bottomBarY = (1 - barSpring) * lbHeight

  const contentStart = 40

  const eyebrowOpacity = interpolate(frame, [contentStart, contentStart + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })

  const titleWords = String(title).split(' ')

  function titleWordStyle(index: number): React.CSSProperties {
    const wordStart = contentStart + 10 + index * 8
    if (animationStyle === 'classic') {
      const s = spring({ fps, frame: Math.max(0, frame - wordStart), config: SPRING_CONFIGS.snappy, durationInFrames: 28 })
      const op = interpolate(frame, [wordStart, wordStart + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      return {
        display: 'inline-block',
        opacity: op,
        transform: `translateY(${(1 - s) * 40}px)`,
        marginRight: Math.round(isBebas ? 24 * scale : 16 * scale),
      }
    } else if (animationStyle === 'modern') {
      const op = interpolate(frame, [contentStart, contentStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      const scl = interpolate(frame, [contentStart, contentStart + 40], [1.06, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })
      return { display: 'inline-block', opacity: op, transform: `scale(${scl})`, marginRight: Math.round(16 * scale) }
    } else {
      const op = interpolate(frame, [contentStart, contentStart + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
      const blur = interpolate(frame, [contentStart, contentStart + 35], [6, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      return { display: 'inline-block', opacity: op, filter: blur > 0 ? `blur(${blur}px)` : undefined, marginRight: Math.round(16 * scale) }
    }
  }

  const lastTitleWordStart = contentStart + 10 + titleWords.length * 8
  const subtitleStart = lastTitleWordStart + 20
  const subtitleOpacity = interpolate(frame, [subtitleStart, subtitleStart + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const subtitleY = interpolate(frame, [subtitleStart, subtitleStart + 28], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })
  const directorOpacity = interpolate(frame, [subtitleStart + 20, subtitleStart + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })

  const stageHeight = height - lbHeight * 2
  const titleFontSize = isBebas ? Math.round(160 * scale) : Math.round(110 * scale)

  return (
    <div style={{ width, height, backgroundColor: String(backgroundColor), fontFamily: font, overflow: 'hidden', position: 'relative' }}>
      {/* Center stage */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: lbHeight, height: stageHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Math.round(16 * scale),
        padding: `0 ${Math.round(120 * scale)}px`,
      }}>
        {eyebrow && (
          <div style={{
            fontSize: Math.round(13 * scale),
            fontWeight: isBebas ? 400 : 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase' as const,
            color: String(accentColor),
            opacity: eyebrowOpacity,
            textAlign: 'center' as const,
          }}>
            {String(eyebrow)}
          </div>
        )}

        <div style={{ textAlign: 'center' as const, lineHeight: 0.9 }}>
          {titleWords.map((word, i) => (
            <span key={i} style={{
              fontSize: titleFontSize,
              fontWeight: isBebas ? 400 : 800,
              color: String(textColor),
              letterSpacing: isBebas ? '0.08em' : '-0.04em',
              textTransform: isBebas ? 'uppercase' as const : 'none' as const,
              ...titleWordStyle(i),
            }}>
              {word}
            </span>
          ))}
        </div>

        {subtitle && (
          <div style={{
            fontSize: Math.round(20 * scale),
            fontWeight: 300,
            color: 'rgba(244,244,245,0.55)',
            letterSpacing: '0.06em',
            textAlign: 'center' as const,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontStyle: 'italic' as const,
          }}>
            {String(subtitle)}
          </div>
        )}
      </div>

      {/* Top letterbox bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: lbHeight,
        backgroundColor: String(letterboxColor),
        transform: `translateY(${topBarY}px)`,
      }} />

      {/* Bottom letterbox bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: lbHeight,
        backgroundColor: String(letterboxColor),
        display: 'flex',
        alignItems: 'center',
        paddingLeft: Math.round(80 * scale),
        transform: `translateY(${bottomBarY}px)`,
      }}>
        {director && (
          <div style={{
            fontSize: Math.round(11 * scale),
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            opacity: directorOpacity,
          }}>
            {String(director)}
          </div>
        )}
      </div>
    </div>
  )
}
