import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { EASING, SPRING_CONFIGS } from '../../utils/easing'
import type { StatCounterProps } from './definition'

function getFont(fontFamily: string): string {
  switch (fontFamily) {
    case 'sf-pro-display': return '"SF Pro Display", system-ui, sans-serif'
    case 'neue-haas-display': return '"Neue Haas Display", "Helvetica Neue", sans-serif'
    default: return 'system-ui, sans-serif'
  }
}

export const StatCounterComposition: React.FC<{
  frame: number
  props: StatCounterProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { value, prefix, suffix, label, backgroundColor, numberColor, labelColor, accentColor, countUpDuration, easingStyle, fontFamily } = props

  const scale = width / 1920
  const font = getFont(String(fontFamily))
  const numericValue = Number(value)
  const duration = Number(countUpDuration)

  const entranceDelay = 10
  const entranceOpacity = interpolate(frame, [entranceDelay, entranceDelay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const entranceY = interpolate(frame, [entranceDelay, entranceDelay + 25], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  let currentValue: number
  const elapsed = Math.max(0, frame - entranceDelay)

  if (easingStyle === 'expo') {
    currentValue = interpolate(elapsed, [0, duration], [0, numericValue], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EASING.easeOutExpo,
    })
  } else if (easingStyle === 'linear') {
    currentValue = interpolate(elapsed, [0, duration], [0, numericValue], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  } else {
    // spring — use spring value mapped to 0→value
    const s = spring({ fps, frame: elapsed, config: SPRING_CONFIGS.slow, durationInFrames: duration })
    currentValue = s * numericValue
  }

  const displayValue = Math.floor(currentValue)

  const labelDelay = entranceDelay + 20
  const labelOpacity = interpolate(frame, [labelDelay, labelDelay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })

  return (
    <div style={{
      width,
      height,
      backgroundColor: String(backgroundColor),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: font,
      overflow: 'hidden',
    }}>
      {/* Number row */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: Math.round(8 * scale),
        opacity: entranceOpacity,
        transform: `translateY(${entranceY}px)`,
      }}>
        {String(prefix) && (
          <span style={{ fontSize: Math.round(72 * scale), fontWeight: 600, color: String(accentColor), lineHeight: 1 }}>
            {String(prefix)}
          </span>
        )}
        <span style={{ fontSize: Math.round(180 * scale), fontWeight: 800, color: String(numberColor), lineHeight: 1, letterSpacing: '-0.04em' }}>
          {displayValue}
        </span>
        {String(suffix) && (
          <span style={{ fontSize: Math.round(72 * scale), fontWeight: 600, color: String(accentColor), lineHeight: 1 }}>
            {String(suffix)}
          </span>
        )}
      </div>

      {/* Label */}
      <div style={{
        fontSize: Math.round(32 * scale),
        fontWeight: 400,
        color: String(labelColor),
        marginTop: Math.round(20 * scale),
        letterSpacing: '0.01em',
        opacity: labelOpacity,
      }}>
        {String(label)}
      </div>
    </div>
  )
}
