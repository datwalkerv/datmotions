import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import { useFont, getFontFamily } from '../../utils/useFont'
import { EASING } from '../../utils/easing'
import type { DataChartProps } from './definition'

export const DataChartComposition: React.FC<{
  frame: number
  props: DataChartProps
  width: number
  height: number
}> = ({ props, width, height }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  useFont(String(props.fontFamily))
  const font = getFontFamily(String(props.fontFamily))
  const scale = width / 1920

  const { title, subtitle, backgroundColor, textColor, trackColor, animationStyle, showValues, showPercentage } = props

  const bars = [
    { label: props.bar1Label, value: Number(props.bar1Value), color: props.bar1Color },
    { label: props.bar2Label, value: Number(props.bar2Value), color: props.bar2Color },
    { label: props.bar3Label, value: Number(props.bar3Value), color: props.bar3Color },
    { label: props.bar4Label, value: Number(props.bar4Value), color: props.bar4Color },
  ].filter(b => String(b.label).trim() !== '')

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  const titleY = interpolate(frame, [0, 28], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutExpo })

  const staggerFrames = animationStyle === 'stagger' ? 18 : 0
  const barStartBase = 24

  function barProgress(index: number): number {
    const start = barStartBase + index * staggerFrames
    return spring({ fps, frame: Math.max(0, frame - start), config: { damping: 18, stiffness: 120, mass: 1.2 }, durationInFrames: 60 })
  }

  function barOpacity(index: number): number {
    const start = barStartBase + index * staggerFrames
    return interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASING.easeOutQuart })
  }

  const barHeight = Math.round(44 * scale)
  const barGap = Math.round(32 * scale)
  const labelWidth = Math.round(180 * scale)
  const valueWidth = Math.round(90 * scale)

  return (
    <div style={{
      width,
      height,
      backgroundColor: String(backgroundColor),
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: `0 ${Math.round(160 * scale)}px`,
      overflow: 'hidden',
    }}>
      <div style={{ marginBottom: Math.round(52 * scale), opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: Math.round(38 * scale), fontWeight: 700, color: String(textColor), letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {String(title)}
        </div>
        {subtitle && (
          <div style={{ fontSize: Math.round(18 * scale), color: 'rgba(244,244,245,0.45)', marginTop: Math.round(8 * scale), fontWeight: 400, letterSpacing: '-0.01em' }}>
            {String(subtitle)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: barGap }}>
        {bars.map((bar, i) => {
          const prog = barProgress(i)
          const op = barOpacity(i)
          const displayValue = Math.round(bar.value * prog)
          const suffix = showPercentage === 'yes' ? '%' : ''

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: Math.round(20 * scale), opacity: op }}>
              <div style={{
                width: labelWidth,
                fontSize: Math.round(16 * scale),
                fontWeight: 500,
                color: 'rgba(244,244,245,0.65)',
                letterSpacing: '0.01em',
                textAlign: 'right' as const,
                flexShrink: 0,
              }}>
                {String(bar.label)}
              </div>

              <div style={{
                flex: 1,
                height: barHeight,
                backgroundColor: String(trackColor),
                borderRadius: Math.round(6 * scale),
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: `${bar.value * prog}%`,
                  backgroundColor: String(bar.color),
                  borderRadius: Math.round(6 * scale),
                  boxShadow: `0 0 ${Math.round(20 * scale)}px ${String(bar.color)}66`,
                }} />
              </div>

              {showValues === 'yes' && (
                <div style={{
                  width: valueWidth,
                  fontSize: Math.round(20 * scale),
                  fontWeight: 700,
                  color: String(bar.color),
                  letterSpacing: '-0.02em',
                  flexShrink: 0,
                }}>
                  {displayValue}{suffix}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
