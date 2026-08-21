import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { useFont, getFontFamily } from '../../utils/useFont'
import { EASING } from '../../utils/easing'
import type { CountdownProps } from './definition'

export const CountdownComposition: React.FC<{
  frame: number
  props: CountdownProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  const { startFrom, label, subLabel, numberColor, labelColor, accentColor, backgroundColor, fontFamily, showRing, ringThickness, direction } = props
  useFont(String(fontFamily))
  const font = getFontFamily(String(fontFamily))
  const scale = Math.min(width, height) / 1080

  const totalCount = Math.max(1, Number(startFrom))
  const framesPerCount = durationInFrames / totalCount
  const currentCountIndex = Math.min(Math.floor(frame / framesPerCount), totalCount - 1)
  const currentNumber = direction === 'down'
    ? totalCount - currentCountIndex
    : currentCountIndex + 1

  const frameWithinCount = frame - currentCountIndex * framesPerCount
  const bounce = spring({ fps, frame: frameWithinCount, config: { damping: 8, stiffness: 400, mass: 0.8 }, durationInFrames: 20 })
  const numberScale = 0.88 + 0.12 * bounce

  const progress = frame / durationInFrames
  const ringProgress = direction === 'down' ? 1 - progress : progress

  const entranceOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const entranceY = interpolate(frame, [0, 30], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  const ringSize = Math.round(420 * scale)
  const thickness = isFinite(Number(ringThickness)) ? Number(ringThickness) : 6
  const ringRadius = ringSize / 2 - thickness * scale * 2
  const circumference = 2 * Math.PI * ringRadius
  const strokeDashoffset = circumference * (1 - ringProgress)

  const isBebas = fontFamily === 'bebas'
  const numFontSize = isBebas ? Math.round(260 * scale) : Math.round(210 * scale)

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
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: ringSize,
        height: ringSize,
        opacity: entranceOpacity,
        transform: `translateY(${entranceY}px)`,
      }}>
        {showRing === 'ring' && (
          <svg
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
            width={ringSize}
            height={ringSize}
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={thickness * scale * 2}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke={String(accentColor)}
              strokeWidth={thickness * scale * 2}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
        )}

        <div style={{
          fontSize: numFontSize,
          fontWeight: isBebas ? 400 : 700,
          color: String(numberColor),
          lineHeight: 1,
          letterSpacing: isBebas ? '0.04em' : '-0.06em',
          transform: `scale(${numberScale})`,
          textAlign: 'center',
          minWidth: Math.round(280 * scale),
        }}>
          {String(currentNumber).padStart(2, '0')}
        </div>
      </div>

      {showRing === 'bar' && (
        <div style={{
          width: Math.round(400 * scale),
          height: Math.round(thickness * scale * 2.5),
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 100,
          overflow: 'hidden',
          marginTop: Math.round(20 * scale),
          opacity: entranceOpacity,
        }}>
          <div style={{
            width: `${ringProgress * 100}%`,
            height: '100%',
            backgroundColor: String(accentColor),
            borderRadius: 100,
          }} />
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: Math.round(8 * scale),
        marginTop: showRing === 'ring' ? Math.round(-16 * scale) : Math.round(24 * scale),
        opacity: entranceOpacity,
      }}>
        <div style={{
          fontSize: Math.round(18 * scale),
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: String(accentColor),
        }}>
          {String(label)}
        </div>
        {subLabel && (
          <div style={{
            fontSize: Math.round(14 * scale),
            fontWeight: 400,
            color: String(labelColor),
            letterSpacing: '0.04em',
          }}>
            {String(subLabel)}
          </div>
        )}
      </div>
    </div>
  )
}
